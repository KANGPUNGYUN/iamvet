import { noIndexMetadata } from '@/lib/metadata';
import AdminLayout from './AdminLayout';

export const metadata = noIndexMetadata;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}