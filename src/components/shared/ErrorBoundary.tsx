"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Log to error reporting service in production
    if (process.env.NODE_ENV === "production") {
      // TODO: Integrate with error reporting service (e.g., Sentry)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--system-background)]">
          <LiquidGlassCard
            className="max-w-2xl w-full"
            blurIntensity="xl"
            interactive={false}
          >
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-[var(--apple-red)]/10">
                  <AlertTriangle
                    className="w-12 h-12 text-[var(--apple-red)]"
                    strokeWidth={2}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-[var(--label)]">
                  Something went wrong
                </h1>
                <p className="text-[var(--secondary-label)]">
                  We encountered an unexpected error. Please try again.
                </p>
              </div>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="mt-6 p-4 rounded-lg bg-[var(--system-fill)] text-left">
                  <p className="text-sm font-mono text-[var(--apple-red)] mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-xs text-[var(--secondary-label)]">
                      <summary className="cursor-pointer mb-2">
                        Stack Trace
                      </summary>
                      <pre className="overflow-auto max-h-48 p-2 bg-[var(--secondary-system-background)] rounded">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <GlassButton
                  onClick={this.handleReset}
                  variant="default"
                  size="default"
                  className="flex items-center gap-2 justify-center"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </GlassButton>
                <GlassButton
                  onClick={this.handleReload}
                  variant="outline"
                  size="default"
                  className="flex items-center gap-2 justify-center"
                >
                  <Home className="w-4 h-4" />
                  Reload Page
                </GlassButton>
              </div>
            </div>
          </LiquidGlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}

