import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 sm:p-8 relative overflow-hidden">
      {/* Dynamic background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-30%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse duration-8000" />
        <div className="absolute top-[50%] right-[-20%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[120px] animate-pulse duration-10000" />
      </div>
      
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl drop-shadow-md">
            Ustaad<span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-violet-400">PK</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            {`Pakistan's Premier Tutor Network`}
          </p>
        </div>
        
        {/* Glassmorphism wrapper */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5 transition-all hover:ring-white/10">
          {children}
        </div>
      </div>
    </div>
  );
}
