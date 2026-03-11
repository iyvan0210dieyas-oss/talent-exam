"use client";

import type { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Home, User as UserIcon, LogOut } from 'lucide-react';

type HeaderProps = {
  user: User | null;
  attempt: number;
  onGoHome: () => void;
  isAdmin?: boolean;
  onAdminLogout: () => void;
};

export default function Header({ user, attempt, onGoHome, isAdmin = false, onAdminLogout }: HeaderProps) {
  return (
    <header className="w-full bg-gradient-to-r from-primary to-purple-700 text-primary-foreground shadow-lg">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-headline">Talent Tango Puzzle Master</h1>
          <p className="text-sm opacity-90">{isAdmin ? 'Admin Dashboard' : 'Mental Ability Test'}</p>
        </div>
        <div className="flex items-center gap-4">
          {!isAdmin && user && (
            <div className="hidden sm:block text-right bg-white/10 p-2 rounded-lg">
              <p className="font-bold text-sm flex items-center gap-2"><UserIcon size={14} /> {user.name}</p>
              <p className="text-xs opacity-80">Attempt: {attempt}</p>
            </div>
          )}
          {isAdmin ? (
             <Button variant="ghost" className="hover:bg-white/20" onClick={onAdminLogout}><LogOut className="mr-2" /> Logout</Button>
          ) : (
            <Button variant="ghost" className="hover:bg-white/20" onClick={onGoHome}><Home className="mr-2" /> Home</Button>
          )}
        </div>
      </div>
    </header>
  );
}
