import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تسجيل ممارس صحي | مُتْقِن',
  description: 'سجل كممارس صحي وتتبع ساعات التعليم المستمر',
};

export default function HCPRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

