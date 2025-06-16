import React, { useState, useEffect } from 'react';
import './styles/App.css';
import URLDialog from './components/URLDialog';
import JSONEditor from './components/JSONEditor';
import ResponseViewer from './components/ResponseViewer';
import { APIClient, RequestHistory, URLManager } from './utils/api';

function App() {
  const [targetUrl, setTargetUrl] = useState('');
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [jsonInput, setJsonInput] = useState('{\n  "key": "value",\n  "number": 123\n}');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load stored URL on component mount
  useEffect(() => {
    const storedUrl = URLManager.getStoredURL();
    if (storedUrl) {
      setTargetUrl(storedUrl);
    } else {
      setShowUrlDialog(true);
    }
  }, []);

  const handleUrlSave = (url) => {
    const validation = URLManager.validateURL(url);
    if (validation.valid) {
      setTargetUrl(validation.url);
      URLManager.storeURL(validation.url);
      setShowUrlDialog(false);
    } else {
      alert(validation.error);
    }
  };

  const handleSendRequest = async (jsonData) => {
    if (!targetUrl) {
      alert('URLが設定されていません');
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const result = await APIClient.postWithTimeout(targetUrl, jsonData, 30000);
      
      setResponse(result);
      
      // Save to history
      RequestHistory.addRequest(targetUrl, jsonData, result);
      
    } catch (error) {
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
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>JSON POST Tool</h1>
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

      <main className="main-content">
        <div className="content-grid">
          <JSONEditor
            value={jsonInput}
            onChange={setJsonInput}
            onSend={handleSendRequest}
            loading={loading}
          />
          <ResponseViewer response={response} />
        </div>
      </main>

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

