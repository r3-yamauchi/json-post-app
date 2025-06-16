// HTTP Client utility functions
export class APIClient {
  static async post(url, data, options = {}) {
    const defaultOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, {
        ...defaultOptions,
        body: typeof data === 'string' ? data : JSON.stringify(data),
      });

      const responseText = await response.text();
      let responseData;

      // Try to parse as JSON, fallback to text
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = responseText;
      }

      return {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: responseData,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url,
      };
    } catch (error) {
      // Network or other errors
      return {
        success: false,
        status: 0,
        statusText: 'Network Error',
        data: {
          error: error.message,
          type: error.name,
          details: 'Failed to connect to the server. Please check your internet connection and the target URL.',
        },
        headers: {},
        url: url,
      };
    }
  }

  static async postWithTimeout(url, data, timeout = 30000, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const result = await this.post(url, data, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        return {
          success: false,
          status: 0,
          statusText: 'Request Timeout',
          data: {
            error: 'Request timed out',
            type: 'TimeoutError',
            details: `Request exceeded the ${timeout / 1000} second timeout limit.`,
          },
          headers: {},
          url: url,
        };
      }
      
      throw error;
    }
  }
}

// Request history management
export class RequestHistory {
  static getHistory() {
    try {
      const history = localStorage.getItem('json-post-history');
      return history ? JSON.parse(history) : [];
    } catch (e) {
      console.error('Failed to load request history:', e);
      return [];
    }
  }

  static addRequest(url, jsonData, response) {
    try {
      const history = this.getHistory();
      const newEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        url,
        request: jsonData,
        response: {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
        },
      };

      // Keep only the last 50 requests
      const updatedHistory = [newEntry, ...history].slice(0, 50);
      localStorage.setItem('json-post-history', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('Failed to save request history:', e);
    }
  }

  static clearHistory() {
    try {
      localStorage.removeItem('json-post-history');
    } catch (e) {
      console.error('Failed to clear request history:', e);
    }
  }
}

// URL validation and management
export class URLManager {
  static validateURL(url) {
    try {
      const urlObj = new URL(url);
      
      // Check if protocol is http or https
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return {
          valid: false,
          error: 'URL must use HTTP or HTTPS protocol',
        };
      }

      // Check if hostname exists
      if (!urlObj.hostname) {
        return {
          valid: false,
          error: 'URL must include a valid hostname',
        };
      }

      return {
        valid: true,
        url: urlObj.toString(),
      };
    } catch (e) {
      return {
        valid: false,
        error: 'Invalid URL format',
      };
    }
  }

  static getStoredURL() {
    try {
      return localStorage.getItem('json-post-target-url') || '';
    } catch (e) {
      console.error('Failed to load stored URL:', e);
      return '';
    }
  }

  static storeURL(url) {
    try {
      localStorage.setItem('json-post-target-url', url);
    } catch (e) {
      console.error('Failed to store URL:', e);
    }
  }

  static maskURL(url) {
    if (!url) return '';
    
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      const parts = hostname.split('.');
      
      if (parts.length > 2) {
        // subdomain.domain.com -> subdomain.***.com
        parts[1] = '***';
      } else if (parts.length === 2) {
        // domain.com -> ***.com
        parts[0] = '***';
      }
      
      const maskedHostname = parts.join('.');
      const path = urlObj.pathname !== '/' ? urlObj.pathname : '';
      const search = urlObj.search || '';
      
      return `${urlObj.protocol}//${maskedHostname}${path}${search}`;
    } catch (e) {
      // Invalid URL, just mask the middle part
      const length = url.length;
      if (length <= 10) return url;
      
      const start = url.substring(0, Math.floor(length * 0.3));
      const end = url.substring(Math.ceil(length * 0.7));
      return `${start}***${end}`;
    }
  }
}

