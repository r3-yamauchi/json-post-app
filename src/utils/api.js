/**
 * HTTPクライアントユーティリティ関数群
 * APIリクエストの送信、レスポンス処理を担当
 */
export class APIClient {
  /**
   * POSTリクエストを送信する
   * @param {string} url - リクエスト送信先URL
   * @param {any} data - 送信するデータ
   * @param {Object} options - Fetch APIのオプション
   * @returns {Promise<Object>} レスポンスオブジェクト
   */
  static async post(url, data, options = {}) {
    const defaultOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      // Fetch APIを使用してPOSTリクエストを送信
      const response = await fetch(url, {
        ...defaultOptions,
        body: typeof data === 'string' ? data : JSON.stringify(data),
      });

      // レスポンスをテキストとして取得
      const responseText = await response.text();
      let responseData;

      // JSONとしてパースを試み、失敗したらテキストとして扱う
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = responseText;
      }

      // 統一されたレスポンスオブジェクトを返す
      return {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: responseData,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url,
      };
    } catch (error) {
      // ネットワークエラーやその他のエラーの処理
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

  /**
   * タイムアウト付きPOSTリクエストを送信する
   * @param {string} url - リクエスト送信先URL
   * @param {any} data - 送信するデータ
   * @param {number} timeout - タイムアウト時間（ミリ秒）
   * @param {Object} options - Fetch APIのオプション
   * @returns {Promise<Object>} レスポンスオブジェクト
   */
  static async postWithTimeout(url, data, timeout = 30000, options = {}) {
    // AbortControllerを使用してタイムアウトを実装
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // signalを使用してキャンセル可能なリクエストを送信
      const result = await this.post(url, data, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      
      // タイムアウトエラーの場合は専用のレスポンスを返す
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
      
      // その他のエラーは再スロー
      throw error;
    }
  }
}

/**
 * リクエスト履歴管理クラス
 * LocalStorageを使用してリクエスト履歴を保存・管理
 */
export class RequestHistory {
  /**
   * 保存されたリクエスト履歴を取得
   * @returns {Array} リクエスト履歴の配列
   */
  static getHistory() {
    try {
      const history = localStorage.getItem('json-post-history');
      return history ? JSON.parse(history) : [];
    } catch (e) {
      console.error('Failed to load request history:', e);
      return [];
    }
  }

  /**
   * 新しいリクエストを履歴に追加
   * @param {string} url - リクエストURL
   * @param {string} jsonData - 送信したJSONデータ
   * @param {Object} response - レスポンスオブジェクト
   */
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

      // 最新50件のみを保持（メモリ使用量を制限）
      const updatedHistory = [newEntry, ...history].slice(0, 50);
      localStorage.setItem('json-post-history', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('Failed to save request history:', e);
    }
  }

  /**
   * リクエスト履歴をクリア
   */
  static clearHistory() {
    try {
      localStorage.removeItem('json-post-history');
    } catch (e) {
      console.error('Failed to clear request history:', e);
    }
  }
}

/**
 * URL検証と管理のためのクラス
 * URLの妥当性チェック、保存、マスキング機能を提供
 */
export class URLManager {
  /**
   * URLの妥当性を検証
   * @param {string} url - 検証するURL
   * @returns {Object} 検証結果（valid: boolean, error?: string, url?: string）
   */
  static validateURL(url) {
    try {
      const urlObj = new URL(url);
      
      // HTTPまたはHTTPSプロトコルのチェック
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return {
          valid: false,
          error: 'URL must use HTTP or HTTPS protocol',
        };
      }

      // ホスト名の存在チェック
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

  /**
   * 保存されたURLを取得
   * @returns {string} 保存されたURL（存在しない場合は空文字）
   */
  static getStoredURL() {
    try {
      return localStorage.getItem('json-post-target-url') || '';
    } catch (e) {
      console.error('Failed to load stored URL:', e);
      return '';
    }
  }

  /**
   * URLをLocalStorageに保存
   * @param {string} url - 保存するURL
   */
  static storeURL(url) {
    try {
      localStorage.setItem('json-post-target-url', url);
    } catch (e) {
      console.error('Failed to store URL:', e);
    }
  }

  /**
   * URLをマスキングしてプライバシーを保護
   * @param {string} url - マスキングするURL
   * @returns {string} マスキングされたURL
   */
  static maskURL(url) {
    if (!url) return '';
    
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      const parts = hostname.split('.');
      
      if (parts.length > 2) {
        // subdomain.domain.com の場合、サブドメイン部を秘匿
        const subdomain = parts[0];
        if (subdomain.length > 6) {
          // 先頭2文字 + *** + 末尾4文字
          const maskedSubdomain = subdomain.substring(0, 2) + '***' + subdomain.substring(subdomain.length - 4);
          parts[0] = maskedSubdomain;
        } else if (subdomain.length > 2) {
          // 短いサブドメインの場合は中央部分のみ秘匿
          const start = subdomain.substring(0, 1);
          const end = subdomain.substring(subdomain.length - 1);
          parts[0] = start + '***' + end;
        }
        // else: 2文字以下の場合はそのまま
      } else if (parts.length === 2) {
        // domain.com の場合、ドメイン名の一部を秘匿
        const domain = parts[0];
        if (domain.length > 6) {
          const maskedDomain = domain.substring(0, 2) + '***' + domain.substring(domain.length - 4);
          parts[0] = maskedDomain;
        } else if (domain.length > 2) {
          const start = domain.substring(0, 1);
          const end = domain.substring(domain.length - 1);
          parts[0] = start + '***' + end;
        }
      }
      
      // マスキングされたURLを再構築
      const maskedHostname = parts.join('.');
      const path = urlObj.pathname !== '/' ? urlObj.pathname : '';
      const search = urlObj.search || '';
      
      return `${urlObj.protocol}//${maskedHostname}${path}${search}`;
    } catch (e) {
      // 無効なURL形式の場合は中央部分をマスキング
      const length = url.length;
      if (length <= 10) return url;
      
      const start = url.substring(0, Math.floor(length * 0.3));
      const end = url.substring(Math.ceil(length * 0.7));
      return `${start}***${end}`;
    }
  }
}

