import React, { useState } from 'react';

const URLDialog = ({ onSave, onCancel, initialUrl = '' }) => {
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!url.trim()) {
      setError('URLを入力してください');
      return;
    }

    try {
      new URL(url);
      setError('');
      onSave(url.trim());
    } catch (e) {
      setError('有効なURLを入力してください');
    }
  };

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
        <div className="modal-header">
          <h2 className="modal-title">Set Target URL</h2>
        </div>
        <div className="modal-content">
          <p style={{ marginBottom: '1rem', color: '#64748b' }}>
            Enter the URL where POST requests will be sent:
          </p>
          <input
            type="url"
            className="input"
            placeholder="https://api.example.com/endpoint"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError('');
            }}
            onKeyPress={handleKeyPress}
            autoFocus
          />
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
        <div className="modal-footer">
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

