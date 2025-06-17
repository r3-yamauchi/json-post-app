# JSON POST Tool

[English README](./README.md)

JSONデータをPOSTリクエストで送信し、レスポンスを美しくフォーマットして表示する、モダンで使いやすいWebアプリケーションです。

![JSON POST Tool](https://img.shields.io/badge/React-19.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/r3-yamauchi/json-post-app)

## 🚀 機能

- 🎯 **簡単なURL管理**: プライバシーに配慮したマスキング機能付きURL設定
- ✨ **スマートJSONエディタ**: リアルタイムバリデーション、自動フォーマット、テンプレート機能
- 📊 **リッチなレスポンスビューア**: フォーマット済み/生データ表示、ヘッダー情報、コピー機能
- 📱 **レスポンシブデザイン**: デスクトップとモバイルの両方で完璧に動作
- 🔒 **プライバシー重視**: URLマスキングと安全なデータ処理
- ⚡ **高速で信頼性が高い**: Reactと最新のWeb技術で構築
- 💾 **リクエスト履歴**: 最新50件のリクエストを自動保存

## 📋 必要条件

- Node.js 14.0以上
- npmまたはpnpmパッケージマネージャー

## 🛠️ インストール

1. **リポジトリをクローン**
   ```bash
   git clone <repository-url>
   cd json-post-app
   ```

2. **依存関係をインストール**
   ```bash
   npm install
   # または
   pnpm install
   ```

3. **開発サーバーを起動**
   ```bash
   npm start
   ```
   アプリは `http://localhost:3000` で開きます

4. **本番用にビルド**
   ```bash
   npm run build
   ```

## 📖 使用方法ガイド

### 基本的なワークフロー

1. **対象URLを設定**
   - 初回起動時にAPIエンドポイントのURLを入力
   - URLはローカルに保存され、次回以降も使用可能
   - 「Change」ボタンでいつでもURL変更可能

2. **JSONデータを入力**
   - 左側のJSONエディタを使用
   - リアルタイムバリデーションで即座にエラーを表示
   - 一般的なJSON構造のテンプレートを使用
   - ワンクリックでフォーマットまたは圧縮

3. **リクエストを送信**
   - 「Send POST Request」ボタンをクリック
   - ローディングインジケーターを確認
   - 右側にレスポンスが表示される

4. **レスポンスを分析**
   - HTTPステータスコードを確認
   - フォーマット済みと生データビューを切り替え
   - レスポンスデータをクリップボードにコピー
   - ヘッダーとリクエスト詳細を表示

### 高度な機能

#### JSONエディタ
- **リアルタイムバリデーション**: JSON構文エラーを即座にフィードバック
- **自動フォーマット**: 「Format」を押してJSONを整形
- **ミニファイ**: 「Minify」を押してJSONを圧縮
- **テンプレート**: よく使うJSON構造を素早く挿入
- **サイズ表示**: ペイロードサイズを監視
- **キーボードショートカット**:
  - `Tab`: インデントを追加
  - `Shift+Tab`: インデントを削除
  - `Enter`: 自動インデント付き改行

#### レスポンスビューア
- **複数ビュー**: フォーマット済みと生のJSONを切り替え
- **ヘッダーインスペクター**: すべてのレスポンスヘッダーを表示
- **リクエスト詳細**: 送信内容を確認
- **エラー詳細**: 包括的なエラーメッセージ
- **コピー機能**: ワンクリックでクリップボードにコピー

#### データの永続化
- **URL保存**: APIエンドポイントを記憶
- **リクエスト履歴**: 最新50件のリクエストをローカルに保存
- **プライバシーモード**: URLを部分的にマスキングして表示

## 🏗️ アーキテクチャ

### プロジェクト構造
```
json-post-app/
├── public/                 # 静的アセット
├── src/
│   ├── components/        # Reactコンポーネント
│   │   ├── URLDialog.js   # URL設定モーダル
│   │   ├── JSONEditor.js  # JSON入力エディタ
│   │   └── ResponseViewer.js # レスポンス表示
│   ├── utils/            # ユーティリティクラス
│   │   ├── api.js        # APIClient、URLManager、RequestHistory
│   │   └── validation.js # JSONバリデーションユーティリティ
│   ├── styles/           # スタイルシート
│   │   └── App.css       # メインスタイル
│   └── App.js            # ルートコンポーネント
└── README.ja.md          # このファイル
```

### 主要コンポーネント

#### App.js
グローバル状態を管理し、子コンポーネントを調整するメインアプリケーションコンポーネント。

#### URLDialog
- URL入力とバリデーション
- プライバシーに配慮したマスキング表示
- LocalStorageとの統合

#### JSONEditor
- Monaco-editorライクな体験
- リアルタイムJSONバリデーション
- 複数の編集ヘルパー
- サイズ計算

#### ResponseViewer
- ステータスコードの視覚化
- 複数のビューモード
- 包括的なエラーハンドリング
- コピー機能

### ユーティリティクラス

#### APIClient
HTTPリクエストを処理:
- Fetch APIラッパー
- 30秒タイムアウト
- AbortControllerサポート
- エラー分類

#### URLManager
- URLバリデーション
- ストレージ管理
- プライバシーマスキング

#### RequestHistory
- LocalStorageベースの永続化
- 50アイテム制限
- FIFOキュー実装

## 🧪 開発

### 利用可能なスクリプト

| コマンド | 説明 |
|---------|------|
| `npm start` | ポート3000で開発サーバーを起動 |
| `npm test` | テストスイートを実行 |
| `npm test -- --watch` | ウォッチモードでテストを実行 |
| `npm test -- --coverage` | テストカバレッジレポートを生成 |
| `npm run build` | 本番用ビルドを作成 |

### 技術スタック

- **フレームワーク**: React 19.1.0
- **ビルドツール**: Create React App 5.0.1
- **HTTPクライアント**: Fetch API
- **スタイリング**: CSS変数を使用したCSS
- **ストレージ**: LocalStorage API
- **テスト**: Jest + React Testing Library

### ブラウザサポート

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🔒 セキュリティ

- **URLマスキング**: プライバシーのための部分的なURL非表示
- **入力サニタイゼーション**: Reactの組み込みXSS保護
- **外部分析なし**: データはプライベートに保たれます
- **ローカルストレージのみ**: サーバー側のデータ収集なし

## 🤝 コントリビューション

コントリビューションを歓迎します！以下の手順に従ってください：

1. リポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを開く

### 開発ガイドライン

- 既存のコードスタイルに従う
- 新機能にはテストを追加
- 必要に応じてドキュメントを更新
- 提出前にすべてのテストが通ることを確認

## 📝 ライセンス

このプロジェクトはMITライセンスの下でライセンスされています - 詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 🆘 トラブルシューティング

### よくある問題

1. **CORSエラー**
   - APIサーバーがクロスオリジンリクエストを許可していることを確認
   - 開発用にプロキシサーバーの使用を検討

2. **ネットワークエラー**
   - インターネット接続を確認
   - APIエンドポイントがアクセス可能か確認

3. **タイムアウトエラー**
   - デフォルトのタイムアウトは30秒
   - APIが時間内に応答することを確認

### ヘルプの取得

- [Issues](https://github.com/r3-yamauchi/json-post-app/issues)ページを確認
- 英語版の詳細なガイドは[README.md](./README.md)を参照
- バグや機能リクエストのために新しいissueを作成

## 🙏 謝辞

- [Create React App](https://create-react-app.dev/)で構築
- 標準Unicodeセットのアイコンと絵文字
- モダンなAPIテストツールからインスピレーション
