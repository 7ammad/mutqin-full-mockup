import DemoFlowClient from './DemoFlowClient';

export default function DemoFlowPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-4">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">تجربة التدفق التجريبي</h1>
        <p className="text-sm text-gray-600">
          Demo of the end-to-end lifecycle with mocked APIs (no real backend).
        </p>
      </header>
      <DemoFlowClient />
    </main>
  );
}
