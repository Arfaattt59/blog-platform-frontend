// file: frontend/src/components/AuthModal.js
'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/userStore';
import toast from 'react-hot-toast';

export default function AuthModal({ isOpen, closeModal }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const router = useRouter();
  const addUser = useUserStore((state) => state.addUser);

  // State for both forms
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // 'email' field can be username or email
      });
      if (res.ok) {
        const data = await res.json();
        addUser(data);
        toast.success('Login Successful!');
        closeModal();
        router.push('/');
      } else {
        const data = await res.json();
        toast.error(data.message || 'Login failed');
      }
    } catch (error) { toast.error('An error occurred during login.'); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, username }),
      });
      if (res.ok) {
        toast.success('Registration successful! Please log in.');
        setIsLoginView(true);
      } else {
        const data = await res.json();
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) { toast.error('An error occurred.'); }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-30" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                {isLoginView ? (
                  <div>
                    <Dialog.Title as="h3" className="text-2xl font-bold text-center text-gray-900">Login</Dialog.Title>
                    <form onSubmit={handleLogin} className="mt-6 space-y-6">
                       <div>
                          <label className="block text-sm font-medium text-gray-700">Email or Username</label>
                          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm" required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Password</label>
                          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm" required />
                        </div>
                        <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md">Login</button>
                    </form>
                    <p className="mt-4 text-sm text-center">
                      <button onClick={() => setIsLoginView(false)} className="font-medium text-blue-600 hover:underline">Need an account? Sign Up</button>
                    </p>
                  </div>
                ) : (
                  <div>
                    <Dialog.Title as="h3" className="text-2xl font-bold text-center text-gray-900">Create an Account</Dialog.Title>
                     <form onSubmit={handleRegister} className="mt-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm" required />
                        </div>
                        <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md">Sign Up</button>
                    </form>
                    <p className="mt-4 text-sm text-center">
                      <button onClick={() => setIsLoginView(true)} className="font-medium text-blue-600 hover:underline">Already have an account? Login</button>
                    </p>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}