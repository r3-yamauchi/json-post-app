import React, { useState } from 'react';

/**
 * URL設定ダイアログコンポーネント
 * @param {Function} onSave - URL保存時のコールバック関数
 * @param {Function} onCancel - キャンセル時のコールバック関数
 * @param {string} initialUrl - 初期表示するURL（デフォルト: 空文字）
 */
const URLDialog = ({ onSave, onCancel, initialUrl = '' }) => {
  // 入力されたURLの状態管理
  const [url, setUrl] = useState(initialUrl);
  // エラーメッセージの状態管理
  const [error, setError] = useState('');

  /**
   * 保存ボタンクリック時の処理
   * URLの妥当性を検証してから保存コールバックを実行
   */
  const handleSave = () => {
    // 空文字チェック
    if (!url.trim()) {
      setError('URLを入力してください');
      return;
    }

    try {
      // URLの形式検証（URL APIを使用）
      new URL(url);
      setError('');
      onSave(url.trim());
    } catch (e) {
      // URL形式が不正な場合
      setError('有効なURLを入力してください');
    }
  };

  /**
   * キー押下時の処理
   * Enter: 保存、Escape: キャンセル
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* モーダルヘッダー */}
        <div className="modal-header">
          <h2 className="modal-title">Set Target URL</h2>
        </div>
        {/* モーダルコンテンツ */}
        <div className="modal-content">
          <p style={{ marginBottom: '1rem', color: '#64748b' }}>
            Enter the URL where POST requests will be sent:
          </p>
          {/* URL入力フィールド */}
          <input
            type="url"
            className="input"
            placeholder="https://api.example.com/endpoint"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(''); // 入力時にエラーをクリア
            }}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          {/* エラーメッセージ表示エリア */}
          {error && (
            <p style={{ 
              color: '#dc2626', 
              fontSize: '0.875rem', 
              marginTop: '0.5rem' 
            }}>
              {error}
            </p>
          )}
        </div>
        {/* モーダルフッター */}
        <div className="modal-footer">
          {/* 初期URLがある場合のみキャンセルボタンを表示 */}
          {initialUrl && (
            <button className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default URLDialog;

