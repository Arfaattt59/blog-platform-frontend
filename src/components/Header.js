// file: frontend/src/components/Header.js
'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/userStore';
import AuthModal from './AuthModal';
import { Menu, Transition } from '@headlessui/react';
import { UserCircle, ChevronDown } from 'lucide-react';

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, removeUser } = useUserStore();
  const router = useRouter();

  const handleLogout = () => {
    removeUser();
    router.push('/');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white border-b z-40">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <Link href="/" className="text-3xl font-pacifico text-gray-800">
            AI Blog
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="inline-flex items-center w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Hello, {user.name}
                    <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                  </Menu.Button>
                </div>
                <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1">
                      <Menu.Item>{({ active }) => (<button onClick={() => setIsModalOpen(true)} className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>Switch Account</button>)}</Menu.Item>
                    </div>
                    <div className="px-1 py-1">
                      <Menu.Item>{({ active }) => (<button onClick={handleLogout} className={`${active ? 'bg-red-500 text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>Logout</button>)}</Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <UserCircle size={28} />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </header>
      <AuthModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />
    </>
  );
}