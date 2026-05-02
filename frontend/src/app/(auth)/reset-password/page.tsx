'use client';

import { useState, Suspense } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Lock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const passwordValue = useWatch({ control, name: 'newPassword' }) || '';

  const onSubmit = async (data: ResetPasswordValues) => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }

    setIsLoading(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: data.newPassword }),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        setIsSuccess(true);
        toast.success('Password reset successfully');
      } else {
        toast.error(responseData.error || 'Failed to reset password. The link might be expired.');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-6 sm:p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="mx-auto w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6 ring-1 ring-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Password Reset!</h2>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          Your password has been successfully updated. You can now log in with your new password.
        </p>
        <Link href="/login">
          <Button className="w-full bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-[0_0_15px_-5px_rgba(79,70,229,0.4)] hover:shadow-[0_0_20px_-5px_rgba(79,70,229,0.6)] transition-all">
            Continue to Login
          </Button>
        </Link>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Invalid Request</h2>
        <p className="text-zinc-400 mb-8">No reset token found in the URL. Please request a new password reset link.</p>
        <Link href="/forgot-password">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white">
            Request new link
          </Button>
        </Link>
      </div>
    );
  }

  // Password strength logic
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 7) score++;
    if (pass.length > 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };
  const strength = calculateStrength(passwordValue);

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white">Create new password</h2>
        <p className="text-sm text-zinc-400 mt-1">Please enter your new password below</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="newPassword" className="text-zinc-300">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input 
              id="newPassword" 
              type="password" 
              placeholder="••••••••" 
              className="pl-10 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500 transition-all duration-200"
              {...register('newPassword')}
            />
          </div>
          {passwordValue.length > 0 && (
            <div className="flex gap-1.5 mt-3">
              {[1, 2, 3, 4].map((level) => (
                <div 
                  key={level} 
                  className={`h-1.5 w-full rounded-full transition-all duration-500 ${
                    strength >= level 
                      ? strength <= 2 ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]' : strength === 3 ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                      : 'bg-zinc-800'
                  }`} 
                />
              ))}
            </div>
          )}
          {errors.newPassword && <p className="text-xs text-red-400 mt-1">{errors.newPassword.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-zinc-300">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input 
              id="confirmPassword" 
              type="password" 
              placeholder="••••••••" 
              className="pl-10 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500 transition-all duration-200"
              {...register('confirmPassword')}
            />
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <Button 
          type="submit" 
          className="w-full mt-4 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white transition-all duration-300 shadow-[0_0_20px_-5px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.6)]" 
          disabled={isLoading}
        >
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...</>
          ) : (
            'Reset Password'
          )}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
