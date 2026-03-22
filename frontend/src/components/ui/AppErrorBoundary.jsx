import { Component } from 'react';

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error?.message || 'Unknown runtime error' };
  }

  componentDidCatch(error, errorInfo) {
    // Keep console trace for dev diagnostics.
    // eslint-disable-next-line no-console
    console.error('RAKSHAK runtime error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
          <div className="mx-auto max-w-2xl rounded-2xl border border-red-500/40 bg-red-500/10 p-6">
            <h1 className="text-xl font-bold text-red-200">Runtime error in dashboard</h1>
            <p className="mt-2 text-sm text-red-100/90">{this.state.error}</p>
            <p className="mt-4 text-xs text-slate-300">
              Open browser devtools console for full stack trace and share it here.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
