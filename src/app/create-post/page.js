// file: frontend/src/app/create-post/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/userStore';
import toast from 'react-hot-toast';
import { Sparkles } from 'lucide-react'; // Import a nice icon for our button

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false); // State for loading
  const router = useRouter();
  const { user } = useUserStore();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleSuggestion = async () => {
  if (content.trim().length < 50) {
    toast.error('Please write at least 50 characters of content before getting suggestions.');
    return;
  }
  setIsSuggesting(true);
  toast.loading('Generating AI suggestions...');
  try {
    const res = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/ai/suggest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      },
      body: JSON.stringify({ content }),
    });

    toast.dismiss();
    if (res.ok) {
      const data = await res.json();

      // --- This is the corrected logic ---
      setTitle(data.title);     // This line updates the title
      setContent(data.summary); // This line replaces the content
      // ---------------------------------

      toast.success('Suggestions applied!');
    } else {
      toast.error('Failed to get AI suggestions.');
    }
  } catch (error) {
    toast.dismiss();
    toast.error('An error occurred.');
  } finally {
    setIsSuggesting(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}`},
        body: JSON.stringify({ title, content }),
      });
      if (res.ok) {
        toast.success('Post created successfully!');
        router.push('/');
      } else {
        toast.error('Failed to create post.');
      }
    } catch (error) {
      toast.error('An error occurred.');
    }
  };

  if (!user) {
    return <p className="text-center mt-10">Redirecting to login...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create a New Post</h1>
        {/* --- THE NEW AI BUTTON --- */}
        <button 
          onClick={handleSuggestion}
          disabled={isSuggesting}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-purple-400"
        >
          <Sparkles size={16} />
          <span>{isSuggesting ? 'Generating...' : 'Get AI Suggestions'}</span>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows="15" className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm" required />
        </div>
        <div>
          <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Publish Post
          </button>
        </div>
      </form>
    </div>
  );
}