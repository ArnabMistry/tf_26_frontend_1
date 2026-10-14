import { RegisterForm } from '@/components/auth/RegisterForm';
import { Navbar } from '@/components/Navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin registration',
  robots: { index: false, follow: false },
};

export default function AdminRegistrationPage() {
  return <div className="min-h-screen bg-[#241A4C] text-white isolate bg-[url('/assets/bg.webp')] bg-cover">
    <Navbar currentPath="/register" />
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">ADMIN REGISTRATION</h1>
      <p className="mb-6">Create your account with your assigned admin code.</p>
      <RegisterForm admin />
    </main>
  </div>;
}
