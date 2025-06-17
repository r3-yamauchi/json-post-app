import React, { useState, useEffect } from 'react';

const ResponseViewer = ({ response }) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('formatted'); // 'formatted', 'raw', 'headers'
  const [expandedSections, setExpandedSections] = useState({
    headers: false,
    timing: false,
  });

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const copyToClipboard = async (content = null) => {
    try {
      let textToCopy;
      
      if (content) {
        textToCopy = content;
      } else {
        textToCopy = viewMode === 'raw' 
          ? (typeof response.data === 'string' ? response.data : JSON.stringify(response.data))
          : (typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2));
      }
      
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      let textToCopy;
      if (content) {
        textToCopy = content;
      } else {
        textToCopy = viewMode === 'raw' 
          ? (typeof response.data === 'string' ? response.data : JSON.stringify(response.data))
          : (typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2));
      }
      
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
    }
  };

  const formatResponseData = (data) => {
    if (viewMode === 'raw') {
      return typeof data === 'string' ? data : JSON.stringify(data);
    }
    
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return JSON.stringify(parsed, null, 2);
      } catch (e) {
        return data;
      }
    }
    return JSON.stringify(data, null, 2);
  };

  const getStatusBadgeClass = (status) => {
    if (status >= 200 && status < 300) {
      return 'status-badge status-success';
    } else if (status >= 400 && status < 500) {
      return 'status-badge status-error';
    } else if (status >= 500) {
      return 'status-badge status-error';
    } else if (status === 0) {
      return 'status-badge status-error';
    }
    return 'status-badge';
  };

  const getStatusMessage = (status, statusText) => {
    if (status === 0) {
      return 'Network Error';
    }
    return `${status} ${statusText}`;
  };

  const getResponseSize = () => {
    if (!response || !response.data) return '0 B';
    
    const dataString = typeof response.data === 'string' 
      ? response.data 
      : JSON.stringify(response.data);
    
    const bytes = new Blob([dataString]).size;
    
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!response) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Response</h2>
        </div>
        <div className="card-content">
          <div style={{ 
            textAlign: 'center', 
            color: '#64748b', 
            padding: '3rem 2rem',
            fontStyle: 'italic'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>
              📡
            </div>
            <p>Send a request to see the response here</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              The response will include status, headers, and formatted data
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">Response</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {getResponseSize()}
            </span>
            <button 
              className="copy-btn"
              onClick={() => copyToClipboard()}
              title="Copy response to clipboard"
            >
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
          </div>
        </div>
        
        {/* Status and View Mode Controls */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '1rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <span className={getStatusBadgeClass(response.status)}>
            {getStatusMessage(response.status, response.statusText)}
          </span>
          
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button
              className={`btn ${viewMode === 'formatted' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('formatted')}
              style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}
            >
              Formatted
            </button>
            <button
              className={`btn ${viewMode === 'raw' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('raw')}
              style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}
            >
              Raw
            </button>
          </div>
        </div>
      </div>
      
      <div className="card-content">
        <div className="response-container">
          {/* Main Response Content */}
          <div className="response-content" style={{ marginBottom: '1rem' }}>
            {formatResponseData(response.data)}
          </div>
          
          {/* Response Headers */}
          {Object.keys(response.headers).length > 0 && (
            <details 
              open={expandedSections.headers}
              style={{ marginBottom: '1rem' }}
            >
              <summary 
                style={{ 
                  cursor: 'pointer', 
                  fontWeight: '500',
                  color: '#64748b',
                  fontSize: '0.875rem',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid #e2e8f0'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  toggleSection('headers');
                }}
              >
                Response Headers ({Object.keys(response.headers).length})
              </summary>
              {expandedSections.headers && (
                <div style={{ 
                  marginTop: '0.75rem',
                  padding: '0.75rem',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem',
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
                }}>
                  {Object.entries(response.headers).map(([key, value]) => (
                    <div key={key} style={{ 
                      marginBottom: '0.375rem',
                      display: 'flex',
                      wordBreak: 'break-all'
                    }}>
                      <strong style={{ 
                        minWidth: '120px',
                        color: '#475569',
                        marginRight: '0.5rem'
                      }}>
                        {key}:
                      </strong>
                      <span style={{ color: '#1e293b' }}>{value}</span>
                    </div>
                  ))}
                  <button
                    onClick={() => copyToClipboard(
                      Object.entries(response.headers)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join('\n')
                    )}
                    style={{
                      marginTop: '0.5rem',
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.5rem',
                      background: '#e2e8f0',
                      border: 'none',
                      borderRadius: '0.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    Copy Headers
                  </button>
                </div>
              )}
            </details>
          )}
          
          {/* Request Info */}
          {response.url && (
            <details style={{ marginBottom: '1rem' }}>
              <summary style={{ 
                cursor: 'pointer', 
                fontWeight: '500',
                color: '#64748b',
                fontSize: '0.875rem',
                padding: '0.5rem 0',
                borderBottom: '1px solid #e2e8f0'
              }}>
                Request Details
              </summary>
              <div style={{ 
                marginTop: '0.75rem',
                padding: '0.75rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '0.375rem',
                fontSize: '0.75rem',
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
              }}>
                <div style={{ marginBottom: '0.375rem' }}>
                  <strong>URL:</strong> {response.url}
                </div>
                <div style={{ marginBottom: '0.375rem' }}>
                  <strong>Method:</strong> POST
                </div>
                <div>
                  <strong>Content-Type:</strong> application/json
                </div>
              </div>
            </details>
          )}
          
          {/* 失敗したリクエストのエラー詳細 */}
          {!response.success && response.data && typeof response.data === 'object' && response.data.details && (
            <div style={{
              padding: '1rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.5rem',
              marginTop: '1rem'
            }}>
              <h4 style={{ 
                color: '#dc2626', 
                fontSize: '0.875rem', 
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                Error Details
              </h4>
              <p style={{ 
                color: '#7f1d1d', 
                fontSize: '0.875rem',
                margin: 0
              }}>
                {response.data.details}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponseViewer;

