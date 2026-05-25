import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'sans-serif' }}>
          <div style={{ maxWidth: 600, width: '100%', background: '#fee2e2', border: '2px solid #dc2626', borderRadius: 12, padding: '2rem' }}>
            <h1 style={{ color: '#dc2626', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
              App Error — Please Report This
            </h1>
            <p style={{ color: '#7f1d1d', marginBottom: '1rem', fontFamily: 'monospace', fontSize: '0.9rem', wordBreak: 'break-all' }}>
              {this.state.error?.message || 'Unknown error'}
            </p>
            <pre style={{ background: '#fca5a5', padding: '1rem', borderRadius: 8, fontSize: '0.75rem', overflow: 'auto', color: '#450a0a' }}>
              {this.state.error?.stack?.slice(0, 500)}
            </pre>
            <button
              onClick={this.handleReset}
              style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
