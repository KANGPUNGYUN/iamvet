import { noIndexMetadata } from '@/lib/metadata';

export const metadata = noIndexMetadata;

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}