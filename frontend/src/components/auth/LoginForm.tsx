'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { loginSchema, type LoginFormValues } from '@/schemas/auth.schema';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('from') || '/dashboard';
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast.error('Invalid credentials or unverified email. Please check your details and try again.');
      } else {
        toast.success('Welcome back!');
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white">Welcome back</h2>
        <p className="text-sm text-zinc-400 mt-1">Enter your details below to access your dashboard</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input 
              id="email" 
              type="email" 
              placeholder="you@example.com" 
              className="pl-10 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500 transition-all duration-200"
              {...register('email')}
            />
          </div>
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-zinc-300">Password</Label>
            <Link href="/forgot-password" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              className="pl-10 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500 transition-all duration-200"
              {...register('password')}
            />
          </div>
          {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
        </div>

        <Button 
          type="submit" 
          className="w-full mt-2 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white transition-all duration-300 shadow-[0_0_20px_-5px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.6)]" 
          disabled={isLoading}
        >
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authenticating...</>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-zinc-400">
        {`Don't have an account? `}
        <Link href="/register" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
          Create one now
        </Link>
      </div>
    </div>
  );
}
