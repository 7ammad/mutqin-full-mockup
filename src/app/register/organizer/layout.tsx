import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تسجيل منظم | مُتْقِن',
  description: 'سجل كمنظم وابدأ إدارة فعالياتك الطبية المعتمدة',
};

export default function OrganizerRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

