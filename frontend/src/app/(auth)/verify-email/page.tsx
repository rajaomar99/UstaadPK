'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    const verifyToken = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/v1/auth/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        if (res.ok) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (error) {
        setStatus('error');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="p-8 text-center">
      {status === 'loading' && (
        <div className="animate-in fade-in zoom-in duration-500">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-white mb-2">Verifying your email</h2>
          <p className="text-zinc-400">Please wait while we confirm your email address...</p>
        </div>
      )}
      
      {status === 'success' && (
        <div className="animate-in fade-in zoom-in duration-500">
          <div className="mx-auto w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6 ring-1 ring-emerald-500/20 shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
          <p className="text-zinc-400 mb-8">Your account is now fully active.</p>
          <Link href="/login">
            <Button className="w-full bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-[0_0_15px_-5px_rgba(79,70,229,0.4)] hover:shadow-[0_0_20px_-5px_rgba(79,70,229,0.6)] transition-all">
              Continue to Login
            </Button>
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="animate-in fade-in zoom-in duration-500">
          <div className="mx-auto w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6 ring-1 ring-red-500/20 shadow-[0_0_20px_-5px_rgba(239,68,68,0.4)]">
            <XCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
          <p className="text-zinc-400 mb-8">The verification link is invalid or has expired.</p>
          <Link href="/login">
            <Button variant="outline" className="w-full border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white">
              Return to Login
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
