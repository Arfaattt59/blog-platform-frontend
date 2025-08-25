// file: frontend/src/app/post/[id]/edit/page.js
'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/userStore';
import toast from 'react-hot-toast';

export default function EditPostPage({ params }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useUserStore();
const postId = React.use(params).id;

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/posts/${postId}`);
        if (res.ok) {
          const data = await res.json();
          // Security check: ensure the logged-in user is the author of the post
          if (data.user._id !== user._id) {
            toast.error("You're not authorized to edit this post.");
            router.push('/');
          } else {
            setTitle(data.title);
            setContent(data.content);
          }
        }
      } catch (error) {
        toast.error('Failed to fetch post data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [user, router, postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        toast.success('Post updated successfully!');
        router.push('/dashboard');      
      } else {
        toast.error('Failed to update post.');
      }
    } catch (error) {
      toast.error('An error occurred.');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center mb-8">Edit Your Post</h1>
      <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows="10" className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm" required />
        </div>
        <div>
          <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Update Post</button>
        </div>
      </form>
    </div>
  );
}