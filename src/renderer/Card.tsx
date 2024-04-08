import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

interface ExplainContent {
  title: string;
  content: JSX.Element;
}
const explainContents: ExplainContent[] = [
  {
    title: '概要',
    content: (
      <div style={{ fontSize: '10px' }}>
        描いた絵を評価君はアップロードした画像ファイルをClaude 3
        Haikuに評価してもらうアプリです。 評価は以下の内容になります。
        <ul className="no-markers">
          <li>{'・タイトル:アップロードされた画像の内容を言語化したもの。'}</li>
          <li>
            {
              '・絵の上手さ:画像のデッサンの整合性や構図等を考慮した上手さを10点満点で定量評価したもの。'
            }
          </li>
          <li>
            {
              '・コメント:アップロードされた画像に対しての評価内容や印象等のコメント。'
            }
          </li>
        </ul>
      </div>
    ),
  },
  {
    title: '使い方',
    content: (
      <div style={{ fontSize: '10px' }}>
        <ul className="no-markers">
          <li>{'①右上の[設定]ボタンを押下。'}</li>
          <li>{'②Anthropic APIキーを入力し、[保存]ボタンを押下。'}</li>
          <li>{'※APIキー発行手順に関しては以下を参照のこと'}</li>
          <li>{'https://support.anthropic.com/ja/articles/8114521'}</li>
          <li>
            {
              '③[作品を評価してもらう]ボタンを押下し、評価してもらう画像を選択する。'
            }
          </li>
        </ul>
      </div>
    ),
  },
  {
    title: '免責',
    content: (
      <div style={{ fontSize: '10px' }}>
        本アプリケーション（以下、「本アプリ」といいます。）は開発者が学習・検証を目的として提供している非商用目的のアプリです。本アプリの利用者（以下、「ユーザー」といいます。）は、本アプリを自己の責任で利用するものとし、本アプリの利用によってユーザー自身または第三者が被ったいかなる損害または不利益についても、本アプリの開発者および提供者は一切の責任を負いません。
        また、本アプリはAnthropic社が提供する生成AI技術のAPI（以下、「Claude
        API」といいます。）を利用しています。
        <ul className="no-markers">
          <li>
            1.
            本アプリの情報、サービス、機能等は、「現状有姿」で提供され、その正確性、完全性、信頼性、安全性、特定目的への適合性、第三者の権利非侵害等について、明示または暗示を問わず、いかなる保証も行いません。
          </li>
          <li>
            2.
            本アプリまたはそのコンテンツの使用から生じるいかなる直接的、間接的、付随的、特別な、懲罰的またはその他の損害（利益の損失、業務の中断、プログラムやその他のデータの損失を含む）について、本アプリの開発者および提供者は責任を負わず、ユーザーが自己の責任でこれらのリスクを負担するものとします。
          </li>
          <li>
            3.
            本アプリを通じて扱うリソースに関しては、その内容の正確性や信頼性について一切の責任を負いませんし、第三者のサイトやリソースの利用によって生じたいかなる損害や損失についても責任を負いません。
          </li>
          <li>
            4.
            ユーザーは、Anthropic社のウェブサイトでAPI利用規約を確認し、その内容を理解する責任を負います。
          </li>
          <li>
            5.
            本免責事項は、法律で禁止されている範囲を除き、全てのユーザーに適用されます。
          </li>
        </ul>
        ユーザーは、本アプリの利用にあたり、この免責事項に同意したものとみなされます。
      </div>
    ),
  },
];
const card = (
  <React.Fragment>
    <CardActions>
      <List>
        {explainContents.map((explain, index) => (
          <ListItem key={index}>
            <ListItemText primary={explain.title} secondary={explain.content} />
          </ListItem>
        ))}
      </List>{' '}
    </CardActions>
  </React.Fragment>
);

export default function OutlinedCard() {
  return (
    <Box sx={{ minWidth: 275, marginTop: '30px' }}>
      <Card variant="outlined">{card}</Card>
    </Box>
  );
}
