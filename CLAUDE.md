# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際のClaude Code (claude.ai/code)へのガイダンスを提供します。

## プロジェクト概要

JSON POST Toolは、JSONデータをHTTP POSTリクエストで送信し、レスポンスを視覚化するReactベースのWebアプリケーションです。

## 開発コマンド

### 基本コマンド
```bash
# 開発サーバーの起動（ポート3000）
npm start

# プロダクションビルド
npm run build

# テストの実行
npm test

# テストを監視モードで実行
npm test -- --watch

# カバレッジ付きテスト実行
npm test -- --coverage
```

### 依存関係の管理
```bash
# 依存関係のインストール
npm install

# 特定のパッケージを追加
npm install <package-name>
```

## アーキテクチャと構造

### コンポーネント階層
```
App.js (メインコンポーネント)
├── URLDialog (URL設定ダイアログ)
├── JSONEditor (JSON入力エディタ)
└── ResponseViewer (レスポンス表示)
```

### データフロー
1. **URL管理**: `URLManager`クラスがURLの保存、検証、マスキングを担当
2. **APIリクエスト**: `APIClient`クラスがHTTPリクエストとタイムアウト処理を実装
3. **履歴管理**: `RequestHistory`クラスがLocalStorageを使用してリクエスト履歴を管理（最大50件）
4. **状態管理**: ReactのuseStateフックでローカル状態を管理（Redux等は未使用）

### 重要な実装詳細

#### APIリクエスト処理
- Fetch APIを使用（Axiosはpackage.jsonにあるが実際は未使用）
- 30秒のタイムアウト設定
- AbortControllerによるリクエストキャンセル対応
- レスポンスはJSONとテキストの両方に対応

#### エラーハンドリング
- ネットワークエラー、タイムアウト、CORS エラーを個別に処理
- エラー時は詳細な情報を含むオブジェクトを返す
- UIでユーザーフレンドリーなエラー表示

#### LocalStorage使用箇所
- `json-post-target-url`: 対象URLの保存
- `json-post-history`: リクエスト履歴（最大50件）

### セキュリティ考慮事項
- URLマスキング機能でプライバシー保護
- XSS対策（Reactのデフォルト保護）
- 入力値のサニタイゼーション

## テスト方針

Create React Appのデフォルトテスト環境を使用：
- Jest + React Testing Library
- `setupTests.js`でjest-domの設定済み
- コンポーネントテストは`*.test.js`ファイルに記述

## スタイリング

- CSS Modulesは未使用（通常のCSSファイル）
- メインスタイル: `src/styles/App.css`
- レスポンシブデザイン対応
- CSS変数でテーマカラー管理

## 注意事項

1. **Axiosの扱い**: package.jsonに含まれているが、実際はFetch APIを使用している
2. **React Scripts**: v5.0.1を使用。ejectは行わない
3. **ブラウザ互換性**: モダンブラウザのみ対応（IE非対応）