"use client";

import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APIError, NetworkError, AuthenticationError } from '@/services/api';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to your error tracking service
    console.error('Error caught by boundary:', {
      error,
      errorInfo,
      stack: error.stack
    });
  }

  handleRetry = () => {
    this.setState({ error: null, errorInfo: null });
  };

  render() {
    if (this.state.error) {
      let title = 'Something went wrong';
      let message = 'An unexpected error occurred. Please try again.';
      let showRetry = true;

      // Handle specific error types
      if (this.state.error instanceof APIError) {
        title = 'API Error';
        message = this.state.error.message;
      } else if (this.state.error instanceof NetworkError) {
        title = 'Network Error';
        message = 'Please check your internet connection and try again.';
      } else if (this.state.error instanceof AuthenticationError) {
        title = 'Authentication Error';
        message = 'Please sign in again to continue.';
        showRetry = false;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            {showRetry && (
              <Button
                onClick={this.handleRetry}
                className="flex items-center gap-2"
              >
                <RefreshCcw className="h-4 w-4" />
                Try Again
              </Button>
            )}
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-4 text-left bg-gray-100 p-4 rounded-lg">
                <summary className="cursor-pointer mb-2 text-sm font-medium">
                  Error Details
                </summary>
                <pre className="text-xs overflow-auto">
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC to wrap components with error boundary
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}