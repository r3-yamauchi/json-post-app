/**
 * JSON検証とフォーマットユーティリティ
 * JSONの妥当性チェック、整形、最小化機能を提供
 */
export class JSONValidator {
  /**
   * JSON文字列の妥当性を検証
   * @param {string} jsonString - 検証するJSON文字列
   * @returns {Object} 検証結果（valid, error, line, column）
   */
  static validate(jsonString) {
    // 空または文字列以外の入力チェック
    if (!jsonString || typeof jsonString !== 'string') {
      return {
        valid: false,
        error: 'Input is empty or not a string',
        line: 0,
        column: 0,
      };
    }

    // 空白文字を除去して再チェック
    const trimmed = jsonString.trim();
    if (!trimmed) {
      return {
        valid: false,
        error: 'Input is empty',
        line: 0,
        column: 0,
      };
    }

    try {
      // JSONパースを試みる
      JSON.parse(trimmed);
      return {
        valid: true,
        error: null,
      };
    } catch (error) {
      // エラーメッセージから行と列情報を抽出
      const match = error.message.match(/at position (\d+)/);
      let line = 0;
      let column = 0;

      if (match) {
        // エラー位置から行番号と列番号を計算
        const position = parseInt(match[1], 10);
        const lines = trimmed.substring(0, position).split('\n');
        line = lines.length;
        column = lines[lines.length - 1].length + 1;
      }

      return {
        valid: false,
        error: error.message,
        line,
        column,
      };
    }
  }

  /**
   * JSONを整形（インデント付き）
   * @param {string} jsonString - 整形するJSON文字列
   * @returns {Object} 整形結果（success, formatted, error）
   */
  static format(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      // 2スペースのインデントで整形
      return {
        success: true,
        formatted: JSON.stringify(parsed, null, 2),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * JSONを最小化（余分な空白を削除）
   * @param {string} jsonString - 最小化するJSON文字列
   * @returns {Object} 最小化結果（success, minified, error）
   */
  static minify(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      // 空白を削除して最小化
      return {
        success: true,
        minified: JSON.stringify(parsed),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * JSON文字列のバイトサイズを取得
   * @param {string} jsonString - サイズを計測するJSON文字列
   * @returns {number} バイトサイズ
   */
  static getSize(jsonString) {
    if (!jsonString) return 0;
    return new Blob([jsonString]).size;
  }

  /**
   * JSON文字列のサイズを人間が読みやすい形式で取得
   * @param {string} jsonString - サイズを計測するJSON文字列
   * @returns {string} フォーマットされたサイズ文字列
   */
  static getSizeFormatted(jsonString) {
    const bytes = this.getSize(jsonString);
    
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

/**
 * JSONテンプレート管理クラス
 * プリセットとカスタムテンプレートの管理機能を提供
 */
export class JSONTemplates {
  /**
   * プリセットテンプレートの一覧を取得
   * @returns {Array} テンプレートの配列
   */
  static getTemplates() {
    return [
      {
        name: 'Simple Object',
        description: 'Basic JSON object with key-value pairs',
        template: `{
  "key": "value",
  "number": 123,
  "boolean": true
}`,
      },
      {
        name: 'User Data',
        description: 'Example user information object',
        template: `{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "age": 30,
  "active": true,
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}`,
      },
      {
        name: 'API Request',
        description: 'Common API request structure',
        template: `{
  "action": "create",
  "data": {
    "title": "Sample Title",
    "content": "Sample content here",
    "tags": ["tag1", "tag2"]
  },
  "options": {
    "validate": true,
    "notify": false
  }
}`,
      },
      {
        name: 'Array Data',
        description: 'JSON with array of objects',
        template: `{
  "items": [
    {
      "id": 1,
      "name": "Item 1",
      "value": 100
    },
    {
      "id": 2,
      "name": "Item 2",
      "value": 200
    }
  ],
  "total": 2
}`,
      },
      {
        name: 'Empty Object',
        description: 'Empty JSON object',
        template: '{}',
      },
    ];
  }

  /**
   * カスタムテンプレートを取得
   * @returns {Array} カスタムテンプレートの配列
   */
  static getCustomTemplates() {
    try {
      const templates = localStorage.getItem('json-post-custom-templates');
      return templates ? JSON.parse(templates) : [];
    } catch (e) {
      console.error('Failed to load custom templates:', e);
      return [];
    }
  }

  /**
   * カスタムテンプレートを保存
   * @param {string} name - テンプレート名
   * @param {string} description - テンプレートの説明
   * @param {string} template - JSONテンプレート
   * @returns {Object} 保存結果
   */
  static saveCustomTemplate(name, description, template) {
    try {
      const customTemplates = this.getCustomTemplates();
      const newTemplate = {
        id: Date.now(),
        name,
        description,
        template,
        created: new Date().toISOString(),
      };

      // 最大20件のカスタムテンプレートを保持
      const updatedTemplates = [newTemplate, ...customTemplates].slice(0, 20);
      localStorage.setItem('json-post-custom-templates', JSON.stringify(updatedTemplates));
      
      return { success: true, template: newTemplate };
    } catch (e) {
      console.error('Failed to save custom template:', e);
      return { success: false, error: e.message };
    }
  }

  /**
   * カスタムテンプレートを削除
   * @param {number} id - 削除するテンプレートのID
   * @returns {Object} 削除結果
   */
  static deleteCustomTemplate(id) {
    try {
      const customTemplates = this.getCustomTemplates();
      const updatedTemplates = customTemplates.filter(template => template.id !== id);
      localStorage.setItem('json-post-custom-templates', JSON.stringify(updatedTemplates));
      return { success: true };
    } catch (e) {
      console.error('Failed to delete custom template:', e);
      return { success: false, error: e.message };
    }
  }
}

/**
 * 入力補助ユーティリティクラス
 * テキストエリアでの入力補助機能を提供
 */
export class InputHelpers {
  /**
   * カーソル位置にテキストを挿入
   * @param {HTMLTextAreaElement} textarea - テキストエリア要素
   * @param {string} text - 挿入するテキスト
   * @returns {string} 更新後の値
   */
  static insertAtCursor(textarea, text) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    
    const newValue = value.substring(0, start) + text + value.substring(end);
    textarea.value = newValue;
    
    // 挿入したテキストの後にカーソルを設定
    const newCursorPos = start + text.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    
    return newValue;
  }

  /**
   * 自動インデントのためのスペースを計算
   * @param {HTMLTextAreaElement} textarea - テキストエリア要素
   * @returns {string} インデント用のスペース文字列
   */
  static autoIndent(textarea) {
    const start = textarea.selectionStart;
    const value = textarea.value;
    const lines = value.substring(0, start).split('\n');
    const currentLine = lines[lines.length - 1];
    
    // 現在の行の先頭スペースをカウント
    const leadingSpaces = currentLine.match(/^(\s*)/)[1];
    
    // 行末が { または [ の場合は追加インデント
    const extraIndent = /[{[]$/.test(currentLine.trim()) ? '  ' : '';
    
    return leadingSpaces + extraIndent;
  }

  /**
   * Tabキーの処理（インデント/アンインデント）
   * @param {HTMLTextAreaElement} textarea - テキストエリア要素
   * @param {boolean} shiftKey - Shiftキーが押されているか
   * @returns {string} 更新後の値
   */
  static handleTabKey(textarea, shiftKey = false) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    
    if (start === end) {
      // 選択範囲がない場合、タブを挿入/削除
      if (shiftKey) {
        // インデントを削除
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const lineEnd = value.indexOf('\n', start);
        const line = value.substring(lineStart, lineEnd === -1 ? value.length : lineEnd);
        
        if (line.startsWith('  ')) {
          const newValue = value.substring(0, lineStart) + line.substring(2) + value.substring(lineEnd === -1 ? value.length : lineEnd);
          textarea.value = newValue;
          textarea.setSelectionRange(start - 2, start - 2);
          return newValue;
        }
      } else {
        // インデントを追加
        const newValue = value.substring(0, start) + '  ' + value.substring(end);
        textarea.value = newValue;
        textarea.setSelectionRange(start + 2, start + 2);
        return newValue;
      }
    } else {
      // 選択範囲がある場合、選択された行をインデント/アンインデント
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const lineEnd = value.indexOf('\n', end - 1);
      const selectedText = value.substring(lineStart, lineEnd === -1 ? value.length : lineEnd);
      
      const lines = selectedText.split('\n');
      const modifiedLines = lines.map(line => {
        if (shiftKey) {
          return line.startsWith('  ') ? line.substring(2) : line;
        } else {
          return '  ' + line;
        }
      });
      
      const newSelectedText = modifiedLines.join('\n');
      const newValue = value.substring(0, lineStart) + newSelectedText + value.substring(lineEnd === -1 ? value.length : lineEnd);
      
      textarea.value = newValue;
      const offset = shiftKey ? -2 : 2;
      textarea.setSelectionRange(start + offset, end + (offset * lines.length));
      
      return newValue;
    }
    
    return value;
  }
}

