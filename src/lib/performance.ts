/**
 * Performance monitoring utilities
 * Tracks Web Vitals and provides performance insights
 */

export interface WebVitals {
  name: string;
  value: number;
  id: string;
  delta: number;
  entries: PerformanceEntry[];
}

export interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  inp?: number; // Interaction to Next Paint
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      this.initializeObservers();
    }
  }

  private initializeObservers() {
    // Observe FCP (First Contentful Paint)
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            this.metrics.fcp = entry.startTime;
            this.logMetric("FCP", entry.startTime);
          }
        }
      });
      fcpObserver.observe({ entryTypes: ["paint"] });
      this.observers.push(fcpObserver);
    } catch (e) {
      console.warn("FCP observer not supported", e);
    }

    // Observe LCP (Largest Contentful Paint)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
        const lcpValue = lastEntry.renderTime || lastEntry.loadTime;
        if (lcpValue !== undefined) {
          this.metrics.lcp = lcpValue;
          this.logMetric("LCP", lcpValue);
        }
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
      this.observers.push(lcpObserver);
    } catch (e) {
      console.warn("LCP observer not supported", e);
    }

    // Observe FID (First Input Delay)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as PerformanceEntry & { processingStart: number };
          this.metrics.fid = fidEntry.processingStart - fidEntry.startTime;
          this.logMetric("FID", this.metrics.fid);
        }
      });
      fidObserver.observe({ entryTypes: ["first-input"] });
      this.observers.push(fidObserver);
    } catch (e) {
      console.warn("FID observer not supported", e);
    }

    // Observe CLS (Cumulative Layout Shift)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value;
            this.metrics.cls = clsValue;
            this.logMetric("CLS", clsValue);
          }
        }
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });
      this.observers.push(clsObserver);
    } catch (e) {
      console.warn("CLS observer not supported", e);
    }

    // Observe TTFB (Time to First Byte)
    try {
      const navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "navigation") {
            const navEntry = entry as PerformanceNavigationTiming;
            this.metrics.ttfb =
              navEntry.responseStart - navEntry.requestStart;
            this.logMetric("TTFB", this.metrics.ttfb);
          }
        }
      });
      navigationObserver.observe({ entryTypes: ["navigation"] });
      this.observers.push(navigationObserver);
    } catch (e) {
      console.warn("TTFB observer not supported", e);
    }

    // Observe INP (Interaction to Next Paint) - New Web Vital
    try {
      const inpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const eventEntry = entry as PerformanceEntry & { processingStart: number };
          if (eventEntry.entryType === "first-input") {
            const firstInputDelay = eventEntry.processingStart - eventEntry.startTime;
            this.metrics.inp = firstInputDelay;
            this.logMetric("INP", firstInputDelay);
          }
        }
      });
      inpObserver.observe({ entryTypes: ["first-input"] });
      this.observers.push(inpObserver);
    } catch (e) {
      console.warn("INP observer not supported", e);
    }
  }

  private logMetric(name: string, value: number) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[Performance] ${name}: ${value.toFixed(2)}ms`);
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === "production") {
      // TODO: Send to analytics service
      // Example: analytics.track('web_vital', { name, value });
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getMetricScore(metric: keyof PerformanceMetrics): "good" | "needs-improvement" | "poor" {
    const value = this.metrics[metric];
    if (!value) return "poor";

    // Web Vitals thresholds
    const thresholds: Record<string, { good: number; poor: number }> = {
      fcp: { good: 1800, poor: 3000 },
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      ttfb: { good: 800, poor: 1800 },
      inp: { good: 200, poor: 500 },
    };

    const threshold = thresholds[metric];
    if (!threshold) return "poor";

    if (value <= threshold.good) return "good";
    if (value <= threshold.poor) return "needs-improvement";
    return "poor";
  }

  measureComponentRender(componentName: string, renderFn: () => void) {
    if (typeof window === "undefined") {
      renderFn();
      return;
    }

    const start = performance.now();
    renderFn();
    const end = performance.now();
    const duration = end - start;

    if (process.env.NODE_ENV === "development") {
      console.log(`[Performance] ${componentName} render: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  measureAsyncOperation<T>(operationName: string, operation: () => Promise<T>): Promise<T> {
    if (typeof window === "undefined") {
      return operation();
    }

    const start = performance.now();
    return operation().then((result) => {
      const end = performance.now();
      const duration = end - start;

      if (process.env.NODE_ENV === "development") {
        console.log(
          `[Performance] ${operationName}: ${duration.toFixed(2)}ms`
        );
      }

      return result;
    });
  }

  disconnect() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
export const performanceMonitor = typeof window !== "undefined"
  ? new PerformanceMonitor()
  : null;

// Export convenience functions
export function measureRender(componentName: string, renderFn: () => void) {
  return performanceMonitor?.measureComponentRender(componentName, renderFn);
}

export function measureAsync<T>(
  operationName: string,
  operation: () => Promise<T>
): Promise<T> {
  if (!performanceMonitor) {
    return operation();
  }
  return performanceMonitor.measureAsyncOperation(operationName, operation);
}

// Web Vitals reporting (for Next.js)
export function reportWebVitals(metric: WebVitals) {
  if (process.env.NODE_ENV === "development") {
    console.log("[Web Vitals]", metric);
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === "production") {
    // TODO: Send to analytics service
    // Example: analytics.track('web_vital', metric);
  }
}

