import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'إنشاء حساب | مُتْقِن',
  description: 'سجل في مُتْقِن وابدأ رحلتك في التعليم الطبي المستمر',
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

