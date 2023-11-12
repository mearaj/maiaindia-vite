import React, { Component, ErrorInfo } from 'react';

interface Props {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error: ', error, errorInfo);
    this.setState({ hasError: true });
  }

  render() {
    const { hasError } = this.state;
    if (hasError) {
      const { fallback } = this.props;
      return fallback;
    }
    const { children } = this.props;
    return children;
  }
}

export default ErrorBoundary;
