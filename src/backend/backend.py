from flask import Flask, request, jsonify
from flask_cors import CORS
import anthropic
import sys
import json5
import re

app = Flask(__name__)
CORS(app,resources={r"/*": {"origins": "http://localhost*"}},)

def handle_api_exception(exception, status_code=500):
    try:
        error_data = json5.loads(str(exception.body))

        if 'error' in error_data and 'message' in error_data['error']:
            message = error_data['error']['message']
        else:
            message = '未知のエラー'
    except Exception:
        message = '未知のエラー'

    return jsonify({'error': message}), status_code

@app.route('/apiv1/review', methods=['POST'])
def get_review():
    data = request.get_json()

    api_key = data.get('api_key')
    image_data = data.get('image_data')
    media_type = data.get('media_type')
    
    if not api_key or api_key == "":
        return jsonify({'error':"Claude APIキーが見つかりません"}),400
    
    if not media_type or media_type == "" or not image_data:
        return jsonify({'error':"無効なリクエストです"}),400
  
    client = anthropic.Anthropic(
        api_key=api_key
    )
    #事前定義テクニックを使用
    # https://docs.anthropic.com/claude/docs/control-output-format#prefilling-claudes-response
    try:
        message = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=4000,
            temperature=0,
            system="""
                    貴方は与えられた絵の上手さを評価する必要があります。以下のタスクを実施してください。
                    <task>
                    絵の上手さを評価するにあたり、評価を次のフォーマットのjson形式で返してください
                    <json_format>
                    {
                    "title" : string(絵のタイトル。日本語である必要があります。),
                    "drawing_score": int(1)(絵のデッサンや構図等を考慮した上手さ。1から10まで。),
                    "comment": string(評価のコメントで、drawing_scoreの採点根拠、及び改善点が必要な点を多めに指摘してください。日本語である必要があります。)
                    }
                    </json_format>

                    以下は出力例です。
                    <example id="1">
                    {
                    "title" : "川に佇む男性",
                    "drawing_score": 5,
                    "comment": "5点である理由はデッサンが崩れているように見えるからです。もう少し人体のプロポーションを勉強しましょうか。"
                    }
                    </example>
                    
                    <example id="2">
                    {
                    "title": "踊る妖精",
                    "drawing_score": 8,
                    "comment": "8点である理由はデッサンが破綻していない為です。"
                    }
                    </example>
                    </task>
                    """,
            messages=[
            {
                "role": "user",
                "content": [
                {
                    "type": "image",
                    "source": {
                    "type": "base64",
                    "media_type": media_type,
                    "data": image_data
                    }
                }
                ]
            },
            {
                "role": "assistant",
                "content": [
                {
                    "type": "text",
                    "text": "{"
                }
                ]
            }
            ]
        )
    except anthropic.APIStatusError as ase:
        return handle_api_exception(ase, status_code=ase.status_code)
    
    except anthropic.APIResponseValidationError as arve:
        return handle_api_exception(arve, status_code=arve.status_code)
    
    except anthropic.APIError as aae:
        return handle_api_exception(aae, status_code=aae.status_code)

    except Exception:
        return jsonify({'error':"未知のエラーです。"}),500
    
    if len(message.content) == 0:
        return jsonify({'error':"有効な評価が生成されませんでした。"}),400
  
    # 生成AIで返された回答が有効なjsonかどうか検証する
    try:
        # 制御文字を置換
        json_str = re.sub(r'[\x00-\x1F\x7F]', '', "{" +message.content[0].text)
        result_json = json5.loads(json_str)
    except json5.JSONDecodeError:
        return jsonify({'error':"有効なjson形式の評価が生成されませんでした。"}),400

    result_json['usage'] = {
        'input_tokens' : message.usage.input_tokens,
        'output_tokens' : message.usage.output_tokens,
    }

    return jsonify(result_json)

@app.route("/apiv1/quit")
def quit():
  shutdown = request.environ.get("werkzeug.server.shutdown")
  if shutdown is None:
        raise RuntimeError('Not running with the Werkzeug Server')
  shutdown()

  return

if __name__ == '__main__':
    app.run(port=sys.argv[1])