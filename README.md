# Oracle Digital Assistant - Service Cloud とのインテグレーション用カスタム・コンポーネントのサンプル

Oracle Digital Assistant と Oracle Service Cloud (RightNow) の
[Knowledge Foundation API](http://documentation.custhelp.com/euf/assets/devdocs/unversioned/Connect_KFAPI/Default.htm)
を使用して、質問に回答するチャットボットを実現するための、カスタム・コンポーネントの実装例です。

Oracle Digital Asssitant のカスタム・コンポーネントの作成やデプロイ手順については、
[「Oracle Digital Assistant - カスタム・コンポーネントの作成」](https://github.com/oracle-japan/oda-customcomponent-accs)
で説明しています。

## 事前準備など

Knowledge Foundation API を利用できるようにするためには、ホワイトリストの設定が必要です。
Oracle Service Cloud の Configuration で `SEC_PAPI_INTEG_HOSTS_KF_SOAP` に、カスタム・コンポーネント・サービスのIPアドレスまたはドメイン名を追加します。

## 使用方法

1. `dotenv_sample` ファイルを同じディレクトリ内で複製し、`.env` にリネームします。
2. `.env` ファイルに、Oracle Service Cloud (RightNow) へのアクセスに必要な情報を記述します。
3. Oracle Application Container Cloud (ACCS) にカスタム・コンポーネント・サービスをデプロイします。
4. カスタム・コンポーネント・サービスが ACCS にデプロイされたら、ACCS アプリケーションに Web ブラウザでアクセスしてみます。
Knowledge Foundation API に正しくアクセスできれば、`GetPopularContent` の結果が JSON で表示されます。

## このサンプルに含まれているカスタム・コンポーネント

### PopularContent

Knowledge Foundation API の `GetPopularContent` をコールします。

| プロパティ名 | タイプ | 必須? | 説明 |
|:----|:----|:----|:----|
|`token`   |`string`|`true` |Knowledge Foundation API をコールする際に必要な Session Token を管理している Dialog Flow コンテキスト変数の名前を指定|
|`product` |`string`|`false`|Product の値を格納している Dialog Flow コンテキスト変数の名前を指定|
|`category`|`string`|`false`|Category の値を格納している Dialog Flow コンテキスト変数の名前を指定|
|`answers` |`string`|`true` |検索結果を格納するための Dialog Flow コンテキスト変数の名前を指定|

### SmartAssistant

Knowledge Foundation API の `GetSmartAssistantSearch` をコールします。

| プロパティ名 | タイプ | 必須? | 説明 |
|:----|:----|:----|:----|
|`token`   |`string`|`true` |Knowledge Foundation API をコールする際に必要な Session Token を管理している Dialog Flow コンテキスト変数の名前を指定|
|`question`|`string`|`true` |Smart Assistant Search の検索ワードを管理している Dialog Flow コンテキスト変数の名前を指定|
|`product` |`string`|`false`|Product の値を格納している Dialog Flow コンテキスト変数の名前を指定|
|`category`|`string`|`false`|Category の値を格納している Dialog Flow コンテキスト変数の名前を指定|
|`answers` |`string`|`true` |検索結果を格納するための Dialog Flow コンテキスト変数の名前を指定|

### ContentDetail

Knowledge Foundation API の `GetContent` をコールします。

| プロパティ名 | タイプ | 必須? | 説明 |
|:----|:----|:----|:----|
|`token`        |`string`|`true`|Knowledge Foundation API をコールする際に必要な Session Token を管理している Dialog Flow コンテキスト変数の名前を指定|
|`contentId`    |`string`|`true`|検索するコンテントのIDが格納された Dialog Flow コンテキスト変数の名前を指定|
|`contentTitle` |`string`|`true`|検索結果から取得した Summary の値を格納するための Dialog Flow コンテキスト変数の名前を指定|
|`contentDetail`|`string`|`true`|検索結果から取得した Solution の値を格納するための Dialog Flow コンテキスト変数の名前を指定|

## Bot の Dialog Flow のサンプル

[`sampleFlow.yaml`](./sampleFlow.yaml) を参照してください。
