import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(err) { return { error: err } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ background: '#0a0a0a', color: '#ff4444', padding: '24px', fontFamily: 'monospace', minHeight: '100vh' }}>
          <h2 style={{ color: '#ff6666' }}>🔴 App Crash Detected</h2>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#ffaaaa', fontSize: '13px' }}>
            {this.state.error?.message}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)
