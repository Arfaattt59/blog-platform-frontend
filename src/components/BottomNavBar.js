// file: frontend/src/components/BottomNavBar.js
'use client';

import Link from 'next/link';
import { Home, Search, PlusSquare, Heart, User } from 'lucide-react';
import useUserStore from '@/store/userStore';

export default function BottomNavBar() {
  const { user } = useUserStore();

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
      <nav className="container mx-auto px-6 h-16 flex justify-around items-center">
        <Link href="/" className="text-gray-600 hover:text-blue-600">
          <Home size={28} />
        </Link>
        <Link href="/search" className="text-gray-600 hover:text-blue-600">
          <Search size={28} />
        </Link>
        <Link href="/create-post" className="text-gray-600 hover:text-blue-600">
          <PlusSquare size={28} />
        </Link>
        <Link href="/notifications" className="text-gray-600 hover:text-blue-600">
          <Heart size={28} />
        </Link>
        {/* The profile icon links to the dashboard if logged in, or opens the login modal if not */}
        {user ? (
          <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
            <User size={28} />
          </Link>
        ) : (
          // This can also be a button to open the modal, but linking to /login which is now a modal is also fine
          <Link href="/login" className="text-gray-600 hover:text-blue-600">
             <User size={28} />
          </Link>
        )}
      </nav>
    </footer>
  );
}