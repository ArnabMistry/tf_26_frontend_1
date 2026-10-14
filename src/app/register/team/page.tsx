import { Suspense } from 'react';
import { Navbar } from '@/components/Navbar';
import { EventRegistration, EventRegistrationLoadingShell } from '@/components/portal/EventRegistration';
export const metadata = { title: 'Team registration', robots: { index: false, follow: false } };
export default function TeamRegisterPage() {
  return <div className="min-h-screen bg-[#241A4C] text-white"><Navbar/><Suspense fallback={<EventRegistrationLoadingShell />}><EventRegistration/></Suspense></div>;
}
