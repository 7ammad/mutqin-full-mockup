import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تسجيل مدير فعاليات | مُتْقِن',
  description: 'سجل كمدير فعاليات وأدر تنفيذ الفعاليات الطبية',
};

export default function EventManagerRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

