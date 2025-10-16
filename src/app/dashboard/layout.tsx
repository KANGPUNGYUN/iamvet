import { noIndexMetadata } from '@/lib/metadata';
import DashboardLayout from './DashboardLayout';

export const metadata = noIndexMetadata;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}