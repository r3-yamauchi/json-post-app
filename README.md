# JSON POST Tool

[日本語版 README](./README.ja.md)

A modern, user-friendly web application for sending JSON POST requests and viewing responses with beautiful formatting.

![JSON POST Tool](https://img.shields.io/badge/React-19.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/r3-yamauchi/json-post-app)

## 🚀 Features

- 🎯 **Easy URL Management**: Set target URL with privacy-friendly masking
- ✨ **Smart JSON Editor**: Real-time validation, auto-formatting, and templates
- 📊 **Rich Response Viewer**: Formatted/raw views, headers, and copy functionality
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- 🔒 **Privacy Focused**: URL masking and secure data handling
- ⚡ **Fast & Reliable**: Built with React and modern web technologies
- 💾 **Request History**: Automatically saves last 50 requests

## 📋 Prerequisites

- Node.js 14.0 or higher
- npm or pnpm package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd json-post-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```

## 📖 Usage Guide

### Basic Workflow

1. **Set Target URL**
   - On first launch, enter your API endpoint URL
   - The URL is saved locally for future sessions
   - Click "Change" button to modify the URL anytime

2. **Write JSON Data**
   - Use the JSON editor on the left side
   - Real-time validation shows errors immediately
   - Use templates for common JSON structures
   - Format or minify JSON with one click

3. **Send Request**
   - Click "Send POST Request" button
   - Watch the loading indicator
   - View response on the right side

4. **Analyze Response**
   - Check HTTP status code
   - Toggle between formatted and raw views
   - Copy response data to clipboard
   - View headers and request details

### Advanced Features

#### JSON Editor
- **Real-time Validation**: Instant feedback on JSON syntax errors
- **Auto-formatting**: Press "Format" to beautify JSON
- **Minification**: Press "Minify" to compress JSON
- **Templates**: Quick insert common JSON structures
- **Size Display**: Monitor your payload size
- **Keyboard Shortcuts**:
  - `Tab`: Add indentation
  - `Shift+Tab`: Remove indentation
  - `Enter`: Auto-indent new line

#### Response Viewer
- **Multiple Views**: Switch between formatted and raw JSON
- **Headers Inspector**: View all response headers
- **Request Details**: See what was sent
- **Error Details**: Comprehensive error messages
- **Copy Function**: One-click copy to clipboard

#### Data Persistence
- **URL Storage**: Remembers your API endpoint
- **Request History**: Last 50 requests saved locally
- **Privacy Mode**: URLs displayed with partial masking

## 🏗️ Architecture

### Project Structure
```
json-post-app/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── URLDialog.js   # URL configuration modal
│   │   ├── JSONEditor.js  # JSON input editor
│   │   └── ResponseViewer.js # Response display
│   ├── utils/            # Utility classes
│   │   ├── api.js        # APIClient, URLManager, RequestHistory
│   │   └── validation.js # JSON validation utilities
│   ├── styles/           # Stylesheets
│   │   └── App.css       # Main styles
│   └── App.js            # Root component
└── README.md             # This file
```

### Key Components

#### App.js
Main application component managing global state and orchestrating child components.

#### URLDialog
- URL input and validation
- Privacy-friendly masking display
- LocalStorage integration

#### JSONEditor
- Monaco-editor-like experience
- Real-time JSON validation
- Multiple editing helpers
- Size calculation

#### ResponseViewer
- Status code visualization
- Multiple view modes
- Comprehensive error handling
- Copy functionality

### Utility Classes

#### APIClient
Handles HTTP requests with:
- Fetch API wrapper
- 30-second timeout
- AbortController support
- Error categorization

#### URLManager
- URL validation
- Storage management
- Privacy masking

#### RequestHistory
- LocalStorage-based persistence
- 50-item limit
- FIFO queue implementation

## 🧪 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server on port 3000 |
| `npm test` | Run test suite |
| `npm test -- --watch` | Run tests in watch mode |
| `npm test -- --coverage` | Generate test coverage report |
| `npm run build` | Create production build |

### Technology Stack

- **Framework**: React 19.1.0
- **Build Tool**: Create React App 5.0.1
- **HTTP Client**: Fetch API
- **Styling**: CSS with CSS Variables
- **Storage**: LocalStorage API
- **Testing**: Jest + React Testing Library

### Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🔒 Security

- **URL Masking**: Partial URL hiding for privacy
- **Input Sanitization**: React's built-in XSS protection
- **No External Analytics**: Your data stays private
- **Local Storage Only**: No server-side data collection

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure your API server allows cross-origin requests
   - Consider using a proxy server for development

2. **Network Errors**
   - Check internet connection
   - Verify API endpoint is accessible

3. **Timeout Errors**
   - Default timeout is 30 seconds
   - Check if API responds within time limit

### Getting Help

- Check the [Issues](https://github.com/r3-yamauchi/json-post-app/issues) page
- Read the detailed guide in [README.ja.md](./README.ja.md) (Japanese)
- Create a new issue for bugs or feature requests

## 🙏 Acknowledgments

- Built with [Create React App](https://create-react-app.dev/)
- Icons and emoji from standard Unicode set
- Inspired by modern API testing tools
