// file: frontend/src/app/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import useUserStore from '@/store/userStore';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user } = useUserStore();
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Move the function definition inside useEffect
    const fetchMyPosts = async () => {
      if (!user || !user.token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/posts/myposts', {
          headers: { 'Authorization': `Bearer ${user.token}` },
          cache: 'no-cache',
        });
        if (res.ok) {
          const data = await res.json();
          setMyPosts(data);
        }
      } catch (error) {
        console.error('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [user]); // Now the dependency array is correct

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    // ... (keep the rest of the handleDelete function the same)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` },
      });
      if (res.ok) {
        toast.success('Post deleted successfully!');
        // To refresh, we can filter the state directly for a faster UI update
        setMyPosts(myPosts.filter(p => p._id !== postId));
      } else {
        toast.error('Failed to delete post.');
      }
    } catch (error) {
      toast.error('An error occurred.');
    }
  };

  // ... (keep the rest of the component's return JSX the same)
  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!user) {
    return (
      <div className="text-center mt-10">
        <p>Please log in to see your dashboard.</p>
        <Link href="/login" className="text-blue-600">Login</Link>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">My Dashboard</h1>
      <h2 className="text-2xl font-semibold mb-4">My Posts</h2>
      {myPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myPosts.map((post) => (
            <div key={post._id} className="flex flex-col">
              <PostCard post={post} />
              <div className="flex justify-end space-x-2 p-2 bg-gray-50 rounded-b-lg">
                <Link href={`/post/${post._id}/edit`} className="px-3 py-1 text-sm text-white bg-yellow-500 rounded hover:bg-yellow-600">Edit</Link>
                <button onClick={() => handleDelete(post._id)} className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>You haven&apos;t created any posts yet.</p>
      )}
    </div>
  );
}