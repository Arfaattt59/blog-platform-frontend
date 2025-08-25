// file: frontend/src/app/post/[id]/page.js
'use client';

import React, { useState, useEffect } from 'react'; // 1. Import React
import Image from 'next/image';
import useUserStore from '@/store/userStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import CommentSection from '@/components/CommentSection';

export default function PostPage({ params }) {
  const { id: postId } = React.use(params); // 2. Unwrap params here to get the ID

  const { user } = useUserStore();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);

  const [likes, setLikes] = useState([]);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // 3. Use the unwrapped postId variable
        const res = await fetch(`http://localhost:5000/api/posts/${postId}`); 
        if (!res.ok) { throw new Error('Post not found'); }
        const data = await res.json();
        setPost(data);
        setLikes(data.likes || []);
        setIsLiked(user ? (data.likes || []).includes(user._id) : false);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId, user]); // 4. Use the unwrapped postId variable here too

  const handleLike = async () => { /* ... same as before ... */ };
  const handleShare = () => { 
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!'); 
  };

  if (loading) return <p className="text-center mt-10">Loading post...</p>;
  if (!post) return <p className="text-center mt-10">Post not found.</p>;

  return (
    // --- Your JSX from before remains the same ---
    <article className="max-w-3xl mx-auto mt-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
        <div className="flex items-center space-x-4 mb-8 text-gray-500">
            <span>By {post.user ? post.user.name : 'Unknown Author'}</span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="relative w-full h-96 mb-8">
            <Image src={post.coverImage || '/images/placeholder.jpg'} alt={post.title} fill className="rounded-lg object-cover" />
        </div>
        <div className="prose prose-lg max-w-none">{post.content}</div>
        <div className="mt-8 pt-4 border-t flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <button onClick={handleLike} className="flex items-center space-x-2 text-gray-500 hover:text-red-500">
                    <Heart className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
                    <span>{likes.length}</span>
                </button>
                <button onClick={() => setShowComments(!showComments)} className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
                    <MessageCircle className="w-6 h-6" />
                    <span>{(post.comments || []).length}</span>
                </button>
                <button onClick={handleShare} className="flex items-center space-x-2 text-gray-500 hover:text-green-500">
                    <Share2 className="w-6 h-6" />
                </button>
            </div>
        </div>
        {showComments && <CommentSection post={post} initialComments={post.comments} />}
    </article>
  );
}