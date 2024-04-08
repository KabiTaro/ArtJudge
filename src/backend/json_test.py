import json5
import json
import re
# JSON文字列の定義
json_str1 = '''
{
title: "かわいいカエル",
"drawing_score": 7,
"comment": "カエルの形が可愛らしく描かれています。"
}
'''
json_str2 = '''
{
"title": "かわいいカエル",
"drawing_score": 7,
"comment": "カエルの形が可愛らしく描かれています。",
}
'''
json_str3 = '''
{
"title": "かわいいカエル",
"drawing_score": 7,
"comment":"カエルの形が可\n愛らしくかれています。"
}
'''

# json5でのデコードテスト
try:
    decoded = json5.loads(json_str1)
    print("json_str1 with json5: Success")
except ValueError as e:
    print("json_str1 with json5: Failed", e)

try:
    decoded = json5.loads(json_str2)
    print("json_str2 with json5: Success")
except ValueError as e:
    print("json_str2 with json5: Failed", e)

try:
    decoded = json5.loads(json_str3)
    print("json_str3 with json5: Success")
except ValueError as e:
    print("json_str3 with json5: Failed", e)

# 標準jsonでのデコードテスト
try:
    decoded = json.loads(json_str1)
    print("json_str1 with json: Success")
except ValueError as e:
    print("json_str1 with json: Failed", e)

try:
    decoded = json.loads(json_str2)
    print("json_str2 with json: Success")
except ValueError as e:
    print("json_str2 with json: Failed", e)

try:
    decoded = json.loads(json_str3)
    print("json_str3 with json: Success")
except ValueError as e:
    print("json_str3 with json: Failed", e)