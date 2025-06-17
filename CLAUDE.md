# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

# 単一テストファイルの実行
npm test -- <ファイル名>
```

### 依存関係の管理
```bash
# 依存関係のインストール（npmまたはpnpmを使用）
npm install
# または
pnpm install

# 特定のパッケージを追加
npm install <package-name>
```

### リント（ESLint）
```bash
# Create React Appの組み込みESLintを使用
# 開発サーバー起動時に自動的に実行される
npm start
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
- Fetch APIを使用
- 30秒のタイムアウト設定
- AbortControllerによるリクエストキャンセル対応
- レスポンスはJSONとテキストの両方に対応

#### エラーハンドリング
- ネットワークエラー、タイムアウト、CORS エラーを個別に処理
- エラー時は詳細な情報を含むオブジェクトを返す
- UIでユーザーフレンドリーなエラー表示

#### UI/UX機能の実装
- **JSONEditor**: リアルタイムバリデーション、ビジュアルステータスバッジ、サイズ表示
- **ResponseViewer**: 複数ビューモード、折りたたみ可能セクション、ステータスバッジ
- **URLDialog**: モーダルオーバーレイ、キーボードショートカット（Enter/Escape）

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
- レスポンシブデザイン対応（ブレークポイント: 768px）
- CSS変数でテーマカラー管理
- Glass-morphismエフェクト使用
- カスタムアニメーション（loading spinner、hover effects）

## 重要な実装パターン

### コンポーネント設計
- すべて関数コンポーネントとReact Hooksを使用
- 状態管理は`useState`によるローカル管理
- 親子間通信はpropsとコールバック関数
- prop-typesによる型検証は未実装

### ユーティリティクラスの責務
- **APIClient** (`src/utils/api.js`): Fetch APIラッパー、タイムアウト処理
- **RequestHistory** (`src/utils/api.js`): 履歴管理、LocalStorage永続化
- **URLManager** (`src/utils/api.js`): URL検証、プライバシーマスキング
- **JSONValidator** (`src/utils/validation.js`): JSON検証、フォーマット、サイズ計算
- **JSONTemplates** (`src/utils/validation.js`): テンプレート管理（5つの組み込みテンプレート）
- **InputHelpers** (`src/utils/validation.js`): エディタ機能（Tab処理、自動インデント）

### LocalStorageスキーマ
```javascript
// URL保存
'json-post-target-url': string

// 履歴保存（最大50件）
'json-post-history': [{
  id: timestamp,
  timestamp: ISO string,
  url: string,
  request: string,
  response: { status, statusText, data }
}]
```

## 注意事項

1. **React Scripts**: v0.0.0となっているため要注意（通常はv5.0.1）
2. **ブラウザ互換性**: モダンブラウザのみ対応（IE非対応）
3. **ファイル編集時の注意**: 修正後は必ず`npm start`でリントエラーがないことを確認すること
4. **パッケージマネージャー**: pnpm-lock.yamlとpackage-lock.jsonの両方が存在
5. **Axiosは使用していない**: Fetch APIのみを使用
