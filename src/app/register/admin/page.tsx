import { RegisterForm } from '@/components/auth/RegisterForm';
import { Navbar } from '@/components/Navbar';

export default function AdminRegistrationPage() {
  return <div className="min-h-screen bg-[#241A4C] text-white isolate bg-[url('/assets/bg.png')] bg-cover">
    <Navbar currentPath="/register" />
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">ADMIN REGISTRATION</h1>
      <p className="mb-6">Create your account with your assigned admin code.</p>
      <RegisterForm admin />
    </main>
  </div>;
}
