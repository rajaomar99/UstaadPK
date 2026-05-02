'use client';

import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-zinc-400 mt-1">Welcome back, {session?.user?.name}</p>
          </div>
          <Button 
            variant="outline" 
            className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
          <h2 className="text-xl font-semibold mb-4">Your Profile Details</h2>
          <pre className="bg-zinc-950 p-4 rounded-lg overflow-auto border border-zinc-800 text-sm text-zinc-300">
            {JSON.stringify(session?.user, null, 2)}
          </pre>
          
          <div className="mt-8">
            <p className="text-zinc-400 text-sm">
              This dashboard is a placeholder. The actual dashboard will be implemented in future sprints based on your role: <span className="font-bold text-indigo-400 capitalize">{session?.user?.role}</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
