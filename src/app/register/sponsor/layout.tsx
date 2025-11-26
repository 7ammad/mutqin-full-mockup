import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تسجيل راعٍ | مُتْقِن',
  description: 'سجل كراعٍ وادعم الفعاليات الطبية',
};

export default function SponsorRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

