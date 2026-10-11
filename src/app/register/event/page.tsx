import { Suspense } from 'react';
import { Navbar } from '@/components/Navbar';
import { EventRegistration } from '@/components/portal/EventRegistration';
export const metadata = { title: 'Event registration', robots: { index: false, follow: false } };
export default function IndividualRegisterPage() {
  return <div className="min-h-screen bg-[#241A4C] text-white"><Navbar/><Suspense fallback={<p className="p-8">Loading event…</p>}><EventRegistration/></Suspense></div>;
}
