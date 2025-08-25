// file: frontend/src/components/PostActions.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/userStore';
import toast from 'react-hot-toast';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

export default function PostActions({ post }) {
  const { user } = useUserStore();
  const router = useRouter();
  const [likes, setLikes] = useState(post.likes || []);
  const [isLiked, setIsLiked] = useState(user ? (post.likes || []).includes(user._id) : false);

  const handleLike = async () => {
    if (!user) {
      toast.error('You must be logged in to like a post.');
      return router.push('/login');
    }
    // ... (Optimistic UI and API call logic is the same)
    const newIsLiked = !isLiked;
    const newLikes = newIsLiked ? [...likes, user._id] : likes.filter(id => id !== user._id);
    setIsLiked(newIsLiked); setLikes(newLikes);
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${post._id}/like`, { method: 'PUT', headers: { 'Authorization': `Bearer ${user.token}` } });
      if (!res.ok) { setIsLiked(!newIsLiked); setLikes(likes); toast.error('Failed to update like.'); }
    } catch (error) { setIsLiked(!newIsLiked); setLikes(likes); toast.error('An error occurred.'); }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/post/${post._id}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="flex items-center space-x-4">
      <button onClick={handleLike} className="flex items-center space-x-2 text-gray-500 hover:text-red-500">
        <Heart className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
        <span>{likes.length}</span>
      </button>

      {/* This is now a simple Link again */}
      <Link href={`/post/${post._id}`} className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
        <MessageCircle className="w-6 h-6" />
        <span>{(post.comments || []).length}</span>
      </Link>

      <button onClick={handleShare} className="flex items-center space-x-2 text-gray-500 hover:text-green-500">
        <Share2 className="w-6 h-6" />
      </button>
    </div>
  );
}