import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '   | ',
  description: '      ',
};

export default function EventManagerRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

