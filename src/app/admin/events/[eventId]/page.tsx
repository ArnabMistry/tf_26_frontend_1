import { AdminPanel } from '@/components/auth/AdminPanel';
export default async function Page({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  return <AdminPanel eventId={eventId} />;
}
