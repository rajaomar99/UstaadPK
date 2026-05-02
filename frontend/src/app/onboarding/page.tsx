'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Loader2, GraduationCap, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'student' | 'tutor' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If user already has a valid role, redirect to dashboard
  if (session?.user?.role === 'student' || session?.user?.role === 'tutor') {
    router.push('/dashboard');
    return null;
  }

  const handleComplete = async () => {
    if (!selectedRole) {
      toast.error('Please select an account type');
      return;
    }

    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/v1/users/onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify({ role: selectedRole })
      });

      if (res.ok) {
        // Force session update so the new role is picked up
        await update({ role: selectedRole });
        toast.success('Onboarding complete!');
        router.push('/dashboard');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to set role');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse duration-8000" />
        <div className="absolute bottom-[10%] right-[20%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px] animate-pulse duration-10000" />
      </div>

      <div className="relative z-10 w-full max-w-lg bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-3xl p-8 sm:p-12 shadow-2xl text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to UstaadPK!</h1>
        <p className="text-zinc-400 mb-10">{`To get started, tell us how you'll be using the platform.`}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <button
            onClick={() => setSelectedRole('student')}
            className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all duration-300 ${
              selectedRole === 'student' 
                ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)] scale-105' 
                : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/50'
            }`}
          >
            <div className={`p-4 rounded-full mb-4 ${selectedRole === 'student' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-800/50'}`}>
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-1">{`I'm a Student`}</h3>
            <p className="text-xs opacity-70">Looking for a tutor</p>
          </button>

          <button
            onClick={() => setSelectedRole('tutor')}
            className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all duration-300 ${
              selectedRole === 'tutor' 
                ? 'border-violet-500 bg-violet-500/10 text-white shadow-[0_0_20px_-5px_rgba(139,92,246,0.3)] scale-105' 
                : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/50'
            }`}
          >
            <div className={`p-4 rounded-full mb-4 ${selectedRole === 'tutor' ? 'bg-violet-500/20 text-violet-400' : 'bg-zinc-800/50'}`}>
              <GraduationCap className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-1">{`I'm a Tutor`}</h3>
            <p className="text-xs opacity-70">Looking to teach</p>
          </button>
        </div>

        <Button 
          onClick={handleComplete}
          disabled={!selectedRole || isLoading}
          size="lg"
          className="w-full bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white transition-all duration-300 shadow-[0_0_20px_-5px_rgba(79,70,229,0.4)]"
        >
          {isLoading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Setting up your account...</>
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    </div>
  );
}
