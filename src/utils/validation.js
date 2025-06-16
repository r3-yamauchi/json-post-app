// JSON validation and formatting utilities
export class JSONValidator {
  static validate(jsonString) {
    if (!jsonString || typeof jsonString !== 'string') {
      return {
        valid: false,
        error: 'Input is empty or not a string',
        line: 0,
        column: 0,
      };
    }

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
      JSON.parse(trimmed);
      return {
        valid: true,
        error: null,
      };
    } catch (error) {
      // Try to extract line and column information from error message
      const match = error.message.match(/at position (\d+)/);
      let line = 0;
      let column = 0;

      if (match) {
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

  static format(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
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

  static minify(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
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

  static getSize(jsonString) {
    if (!jsonString) return 0;
    return new Blob([jsonString]).size;
  }

  static getSizeFormatted(jsonString) {
    const bytes = this.getSize(jsonString);
    
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// JSON template management
export class JSONTemplates {
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

  static getCustomTemplates() {
    try {
      const templates = localStorage.getItem('json-post-custom-templates');
      return templates ? JSON.parse(templates) : [];
    } catch (e) {
      console.error('Failed to load custom templates:', e);
      return [];
    }
  }

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

      const updatedTemplates = [newTemplate, ...customTemplates].slice(0, 20); // Keep max 20 custom templates
      localStorage.setItem('json-post-custom-templates', JSON.stringify(updatedTemplates));
      
      return { success: true, template: newTemplate };
    } catch (e) {
      console.error('Failed to save custom template:', e);
      return { success: false, error: e.message };
    }
  }

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

// Input helpers
export class InputHelpers {
  static insertAtCursor(textarea, text) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    
    const newValue = value.substring(0, start) + text + value.substring(end);
    textarea.value = newValue;
    
    // Set cursor position after inserted text
    const newCursorPos = start + text.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    
    return newValue;
  }

  static autoIndent(textarea) {
    const start = textarea.selectionStart;
    const value = textarea.value;
    const lines = value.substring(0, start).split('\n');
    const currentLine = lines[lines.length - 1];
    
    // Count leading spaces in current line
    const leadingSpaces = currentLine.match(/^(\s*)/)[1];
    
    // Add extra indentation if line ends with { or [
    const extraIndent = /[{[]$/.test(currentLine.trim()) ? '  ' : '';
    
    return leadingSpaces + extraIndent;
  }

  static handleTabKey(textarea, shiftKey = false) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    
    if (start === end) {
      // No selection, insert/remove tab
      if (shiftKey) {
        // Remove indentation
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
        // Add indentation
        const newValue = value.substring(0, start) + '  ' + value.substring(end);
        textarea.value = newValue;
        textarea.setSelectionRange(start + 2, start + 2);
        return newValue;
      }
    } else {
      // Selection exists, indent/unindent selected lines
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

