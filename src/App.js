import React, { useState, useEffect } from 'react';
import './styles/App.css';
import URLDialog from './components/URLDialog';
import JSONEditor from './components/JSONEditor';
import ResponseViewer from './components/ResponseViewer';
import { APIClient, RequestHistory, URLManager } from './utils/api';

/**
 * メインアプリケーションコンポーネント
 * JSON POSTツールのルートコンポーネントで、全体の状態管理を行う
 */
function App() {
  // POSTリクエストの送信先URL
  const [targetUrl, setTargetUrl] = useState('');
  // URL設定ダイアログの表示状態
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  // JSON入力エディタの初期値（サンプルJSON）
  const [jsonInput, setJsonInput] = useState('{\n  "key": "value",\n  "number": 123\n}');
  // APIレスポンスデータ
  const [response, setResponse] = useState(null);
  // リクエスト送信中の状態
  const [loading, setLoading] = useState(false);

  // コンポーネントマウント時に保存されたURLを読み込む
  useEffect(() => {
    const storedUrl = URLManager.getStoredURL();
    if (storedUrl) {
      // 保存されたURLがある場合は設定
      setTargetUrl(storedUrl);
    } else {
      // URLが未設定の場合はダイアログを表示
      setShowUrlDialog(true);
    }
  }, []);

  /**
   * URL保存処理
   * @param {string} url - 保存するURL
   */
  const handleUrlSave = (url) => {
    // URLの妥当性を検証
    const validation = URLManager.validateURL(url);
    if (validation.valid) {
      // 有効なURLの場合は保存
      setTargetUrl(validation.url);
      URLManager.storeURL(validation.url);
      setShowUrlDialog(false);
    } else {
      // 無効なURLの場合はエラーを表示
      alert(validation.error);
    }
  };

  /**
   * POSTリクエスト送信処理
   * @param {string} jsonData - 送信するJSONデータ（文字列）
   */
  const handleSendRequest = async (jsonData) => {
    // URL未設定チェック
    if (!targetUrl) {
      alert('URLが設定されていません');
      return;
    }

    // リクエスト送信開始
    setLoading(true);
    setResponse(null);

    try {
      // 30秒のタイムアウト付きでPOSTリクエストを送信
      const result = await APIClient.postWithTimeout(targetUrl, jsonData, 30000);
      
      // レスポンスを状態に設定
      setResponse(result);
      
      // リクエスト履歴に保存（最大50件）
      RequestHistory.addRequest(targetUrl, jsonData, result);
      
    } catch (error) {
      // 予期しないエラーが発生した場合の処理
      console.error('Request failed:', error);
      setResponse({
        success: false,
        status: 0,
        statusText: 'Unexpected Error',
        data: {
          error: error.message,
          type: error.name,
          details: 'An unexpected error occurred while processing the request.',
        },
        headers: {},
        url: targetUrl,
      });
    } finally {
      // ローディング状態を解除
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* アプリケーションヘッダー */}
      <header className="header">
        <h1>JSON POST Tool</h1>
        {/* URL設定済みの場合は表示（プライバシー保護のためマスキング） */}
        {targetUrl && (
          <div className="url-display">
            <span className="url-text">Target URL: {URLManager.maskURL(targetUrl)}</span>
            <button 
              className="change-url-btn"
              onClick={() => setShowUrlDialog(true)}
            >
              Change
            </button>
          </div>
        )}
      </header>

      {/* メインコンテンツエリア */}
      <main className="main-content">
        <div className="content-grid">
          {/* JSON入力エディタ（左側） */}
          <JSONEditor
            value={jsonInput}
            onChange={setJsonInput}
            onSend={handleSendRequest}
            loading={loading}
          />
          {/* レスポンス表示エリア（右側） */}
          <ResponseViewer response={response} />
        </div>
      </main>

      {/* URL設定ダイアログ（モーダル） */}
      {showUrlDialog && (
        <URLDialog
          onSave={handleUrlSave}
          onCancel={() => targetUrl && setShowUrlDialog(false)}
          initialUrl={targetUrl}
        />
      )}
    </div>
  );
}

export default App;

