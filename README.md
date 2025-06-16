# JSON POST Tool

A modern, user-friendly web application for sending JSON POST requests and viewing responses with beautiful formatting.

## Features

- 🎯 **Easy URL Management**: Set target URL with privacy-friendly masking
- ✨ **Smart JSON Editor**: Real-time validation, auto-formatting, and templates
- 📊 **Rich Response Viewer**: Formatted/raw views, headers, and copy functionality
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- 🔒 **Privacy Focused**: URL masking and secure data handling
- ⚡ **Fast & Reliable**: Built with React and modern web technologies

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd json-post-app
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm start
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Usage

1. **Set Target URL**: Enter the API endpoint URL when prompted
2. **Input JSON**: Use the editor with validation and formatting tools
3. **Send Request**: Click "Send POST Request" to submit
4. **View Response**: Analyze the formatted response with headers and details

## Project Structure

```
json-post-app/
├── public/                 # Static files
├── src/
│   ├── components/        # React components
│   │   ├── URLDialog.js   # URL input dialog
│   │   ├── JSONEditor.js  # JSON input editor
│   │   └── ResponseViewer.js # Response display
│   ├── utils/            # Utility functions
│   │   ├── api.js        # HTTP client utilities
│   │   └── validation.js # JSON validation helpers
│   ├── styles/           # CSS styles
│   │   └── App.css       # Main stylesheet
│   └── App.js            # Main application component
├── USER_GUIDE.md         # Detailed user guide
└── README.md             # This file
```

## Key Components

### URLDialog
- URL input and validation
- Privacy-friendly URL masking
- Local storage integration

### JSONEditor
- Real-time JSON validation
- Auto-formatting and minification
- Template insertion
- Keyboard shortcuts (Tab, Shift+Tab)
- Size calculation

### ResponseViewer
- Status code display
- Formatted/Raw view toggle
- Response headers and request details
- Copy to clipboard functionality
- Error handling and display

## Technical Features

- **HTTP Client**: Robust fetch-based API client with timeout handling
- **JSON Validation**: Real-time syntax checking with error positioning
- **Local Storage**: URL and request history persistence
- **CORS Support**: Cross-origin request handling
- **Error Handling**: Comprehensive error messages and recovery
- **Responsive Design**: Mobile-first CSS with desktop optimization

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Development

### Available Scripts

- `npm start` - Run development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App

### Dependencies

- React 18
- Axios (HTTP client)
- Modern CSS features

## Security

- URL masking for privacy
- Input sanitization
- XSS protection
- Secure data handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please check the USER_GUIDE.md or create an issue in the repository.

