// file: frontend/src/components/PostInteractionWrapper.js
'use client';

import { useState } from 'react';
import useUserStore from '@/store/userStore';
import toast from 'react-hot-toast';
import PostActions from './PostActions';
import CommentSection from './CommentSection';

export default function PostInteractionWrapper({ post }) {
  const { user } = useUserStore();
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(user ? post.likes.includes(user._id) : false);

  const handleLike = async () => {
    if (!user) return;

    // Optimistic UI update
    const newIsLiked = !isLiked;
    const newLikes = newIsLiked 
      ? [...likes, user._id]
      : likes.filter(id => id !== user._id);

    setIsLiked(newIsLiked);
    setLikes(newLikes);

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${post._id}/like`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (!res.ok) {
        // Revert on failure
        setIsLiked(!newIsLiked);
        setLikes(likes);
        toast.error('Failed to update like.');
      }
    } catch (error) {
      // Revert on failure
      setIsLiked(!newIsLiked);
      setLikes(likes);
      toast.error('An error occurred.');
    }
  };

  // We pass the updated post object with the latest likes to the children
  const updatedPost = { ...post, likes };

  return (
    <div>
      <div className="mt-8 pt-4 border-t">
        <PostActions 
          post={updatedPost} 
          isLiked={isLiked} 
          onLike={handleLike}
          onCommentClick={() => setShowComments(!showComments)} 
        />
      </div>
      {showComments && <CommentSection post={updatedPost} initialComments={post.comments} />}
    </div>
  );
}