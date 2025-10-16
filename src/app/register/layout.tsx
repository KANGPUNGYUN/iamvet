import { noIndexMetadata } from '@/lib/metadata';

export const metadata = noIndexMetadata;

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}