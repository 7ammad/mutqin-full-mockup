import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تسجيل جهة رقابية | مُتْقِن',
  description: 'سجل كجهة رقابية واعتمد الفعاليات الطبية',
};

export default function RegulatorRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

