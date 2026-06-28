'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock, User, GraduationCap, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { registerSchema, type RegisterFormValues } from '@/schemas/auth.schema';

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'student'
    }
  });

  const selectedRole = useWatch({ control, name: 'role' });
  const passwordValue = useWatch({ control, name: 'password' }) || '';

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        setIsSuccess(true);
      } else {
        toast.error(responseData.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Network error. Please make sure the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-6 sm:p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="mx-auto w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6 ring-1 ring-emerald-500/20">
          <Mail className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          {`We've sent a verification link to your email address. Please click the link to activate your account.`}
        </p>
        <Button 
          variant="outline" 
          className="w-full border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          onClick={() => router.push('/login')}
        >
          Return to login
        </Button>
      </div>
    );
  }

  // Calculate password strength simple logic
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
        <h2 className="text-xl font-semibold text-white">Create an account</h2>
        <p className="text-sm text-zinc-400 mt-1">{`Join Pakistan's premier tutor network today`}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Role Selector */}
        <div className="space-y-3">
          <Label className="text-zinc-300">I want to join as a</Label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setValue('role', 'student')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 ${selectedRole === 'student' ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-[0_0_15px_-3px_rgba(79,70,229,0.3)]' : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/50'}`}
            >
              <BookOpen className={`w-6 h-6 mb-2 ${selectedRole === 'student' ? 'text-indigo-400' : ''}`} />
              <span className="text-sm font-medium">Student</span>
            </button>
            <button
              type="button"
              onClick={() => setValue('role', 'tutor')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 ${selectedRole === 'tutor' ? 'border-violet-500 bg-violet-500/10 text-white shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)]' : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/50'}`}
            >
              <GraduationCap className={`w-6 h-6 mb-2 ${selectedRole === 'tutor' ? 'text-violet-400' : ''}`} />
              <span className="text-sm font-medium">Tutor</span>
            </button>
          </div>
          {errors.role && <p className="text-xs text-red-400">{errors.role.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-zinc-300">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input 
              id="name" 
              placeholder="Ahmad Ali" 
              className="pl-10 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500 transition-all duration-200"
              {...register('name')}
            />
          </div>
          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
        </div>

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
          <Label htmlFor="password" className="text-zinc-300">Password</Label>
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
          
          {/* Password strength indicator */}
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
          {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
        </div>

        <Button 
          type="submit" 
          className="w-full mt-4 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white transition-all duration-300 shadow-[0_0_20px_-5px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.6)]" 
          disabled={isLoading}
        >
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</>
          ) : (
            'Create account'
          )}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-zinc-400">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
          Sign in instead
        </Link>
      </div>
    </div>
  );
}
