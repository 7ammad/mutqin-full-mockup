import DemoFlowClient from './DemoFlowClient';

const statusLabels: Record<string, string> = {
  draft: 'مسودة / Draft',
  pending_review: 'قيد المراجعة / Pending review',
  approved: 'معتمد / Approved',
  published: 'منشور / Published',
  closed: 'مغلق / Closed',
};

export default function DemoFlowPage() {
  return (
    <main dir="rtl" className="max-w-5xl mx-auto px-4 py-8 space-y-4 font-[Cairo]">
      <header className="space-y-2 text-right">
        <h1 className="text-2xl font-semibold">تجربة التدفق التجريبي</h1>
        <p className="text-sm text-gray-600">
          Demo of the end-to-end lifecycle with mocked APIs (no real backend).
        </p>
      </header>

      <section className="border rounded p-4 bg-white text-right space-y-2">
        <h2 className="text-lg font-semibold">معرفات التجربة / Demo IDs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
          <div>eventId: evt-1</div>
          <div>organizerId: org-1</div>
          <div>eventManagerId: em-1</div>
          <div>hcpId: hcp-1</div>
          <div>vendorId: vendor-1</div>
          <div>accreditationId: acc-1</div>
        </div>
        <div className="text-xs text-gray-500">
          الحالات / Status examples:
          <div className="flex flex-wrap gap-2 mt-1">
            {Object.entries(statusLabels).map(([key, label]) => (
              <span key={key} className="px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <DemoFlowClient />
    </main>
  );
}
