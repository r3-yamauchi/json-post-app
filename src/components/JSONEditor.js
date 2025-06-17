import React, { useState, useRef } from 'react';
import { JSONValidator, InputHelpers } from '../utils/validation';

/**
 * JSON入力エディタコンポーネント
 * JSONデータの入力、検証、フォーマット、送信機能を提供
 * @param {string} value - JSON入力値
 * @param {Function} onChange - 入力変更時のコールバック
 * @param {Function} onSend - 送信ボタンクリック時のコールバック
 * @param {boolean} loading - ローディング状態
 */
const JSONEditor = ({ value, onChange, onSend, loading }) => {
  // エラーメッセージの状態管理
  const [error, setError] = useState('');
  // テキストエリアへの参照
  const textareaRef = useRef(null);

  /**
   * JSONの妥当性をチェック
   * @param {string} jsonString - 検証するJSON文字列
   * @returns {boolean} 有効なJSONかどうか
   */
  const validateJSON = (jsonString) => {
    const validation = JSONValidator.validate(jsonString);
    return validation.valid;
  };

  /**
   * 送信ボタンクリック時の処理
   * JSONの妥当性を検証してから送信
   */
  const handleSend = () => {
    // 空文字チェック
    if (!value.trim()) {
      setError('JSONを入力してください');
      return;
    }

    // JSON形式の検証
    const validation = JSONValidator.validate(value);
    if (!validation.valid) {
      setError(`Invalid JSON: ${validation.error}`);
      return;
    }

    // エラーをクリアして送信
    setError('');
    onSend(value);
  };

  /**
   * 入力変更時の処理
   * リアルタイムでJSONの妥当性をチェック
   */
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // 入力がある場合のみ検証
    if (newValue.trim()) {
      const validation = JSONValidator.validate(newValue);
      if (!validation.valid) {
        // エラー位置（行、列）を含めて表示
        setError(`Line ${validation.line}, Column ${validation.column}: ${validation.error}`);
      } else {
        setError('');
      }
    } else {
      setError('');
    }
  };

  /**
   * キー押下時の処理
   * Tabキーでインデント、Enterキーで自動インデントを実装
   */
  const handleKeyDown = (e) => {
    const textarea = e.target;
    
    if (e.key === 'Tab') {
      // Tabキーでインデント挿入/削除
      e.preventDefault();
      const newValue = InputHelpers.handleTabKey(textarea, e.shiftKey);
      onChange(newValue);
    } else if (e.key === 'Enter') {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      // 選択範囲がない場合のみ自動インデント
      if (start === end) {
        const indent = InputHelpers.autoIndent(textarea);
        if (indent) {
          e.preventDefault();
          const newValue = InputHelpers.insertAtCursor(textarea, '\n' + indent);
          onChange(newValue);
        }
      }
    }
  };

  /**
   * JSONを整形（フォーマット）する
   * インデント付きの見やすい形式に変換
   */
  const formatJSON = () => {
    const result = JSONValidator.format(value);
    if (result.success) {
      onChange(result.formatted);
      setError('');
    } else {
      setError(`Cannot format: ${result.error}`);
    }
  };

  /**
   * JSONを最小化（ミニファイ）する
   * 余分な空白や改行を削除
   */
  const minifyJSON = () => {
    const result = JSONValidator.minify(value);
    if (result.success) {
      onChange(result.minified);
      setError('');
    } else {
      setError(`Cannot minify: ${result.error}`);
    }
  };

  /**
   * 入力をクリアする
   */
  const clearJSON = () => {
    onChange('');
    setError('');
  };

  /**
   * テンプレートを挿入する
   * @param {string} template - 挿入するJSONテンプレート
   */
  const insertTemplate = (template) => {
    onChange(template);
    setError('');
  };

  /**
   * 現在の入力の検証状態を取得
   * @returns {string|null} 'valid', 'invalid', またはnull
   */
  const getValidationStatus = () => {
    if (!value.trim()) return null;
    const validation = JSONValidator.validate(value);
    return validation.valid ? 'valid' : 'invalid';
  };

  // 検証状態とJSONサイズを取得
  const validationStatus = getValidationStatus();
  const jsonSize = JSONValidator.getSizeFormatted(value);

  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">JSON Input</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {validationStatus && (
              <span 
                className={`status-badge ${validationStatus === 'valid' ? 'status-success' : 'status-error'}`}
                style={{ fontSize: '0.75rem' }}
              >
                {validationStatus === 'valid' ? '✓ Valid JSON' : '✗ Invalid JSON'}
              </span>
            )}
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {jsonSize}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary"
            onClick={formatJSON}
            disabled={!value.trim() || loading}
            style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}
          >
            Format
          </button>
          <button 
            className="btn btn-secondary"
            onClick={minifyJSON}
            disabled={!value.trim() || loading}
            style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}
          >
            Minify
          </button>
          <button 
            className="btn btn-secondary"
            onClick={clearJSON}
            disabled={loading}
            style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}
          >
            Clear
          </button>
          {/* テンプレート選択ドロップダウン */}
          <select
            onChange={(e) => e.target.value && insertTemplate(e.target.value)}
            disabled={loading}
            style={{
              fontSize: '0.75rem',
              padding: '0.375rem 0.5rem',
              border: '1px solid #e2e8f0',
              borderRadius: '0.375rem',
              background: 'white',
            }}
            value=""
          >
            <option value="">Templates...</option>
            <option value='{\n  "key": "value",\n  "number": 123\n}'>Simple Object</option>
            <option value='{\n  "name": "John Doe",\n  "email": "john@example.com",\n  "age": 30\n}'>User Data</option>
            <option value='{\n  "action": "create",\n  "data": {\n    "title": "Sample"\n  }\n}'>API Request</option>
            <option value='{}'>Empty Object</option>
          </select>
        </div>
      </div>
      <div className="card-content">
        <div className="form-group">
          {/* JSON入力テキストエリア */}
          <textarea
            ref={textareaRef}
            className="textarea"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter JSON data here..."
            disabled={loading}
            style={{
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              tabSize: 2,
            }}
          />
          {/* エラーメッセージ表示 */}
          {error && (
            <p style={{ 
              color: '#dc2626', 
              fontSize: '0.875rem', 
              marginTop: '0.5rem',
              fontFamily: 'monospace',
            }}>
              {error}
            </p>
          )}
        </div>
        <button
          className="btn btn-primary"
          onClick={handleSend}
          disabled={loading || !value.trim() || validationStatus === 'invalid'}
          style={{ width: '100%' }}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Sending Request...
            </>
          ) : (
            'Send POST Request'
          )}
        </button>
      </div>
    </div>
  );
};

export default JSONEditor;

