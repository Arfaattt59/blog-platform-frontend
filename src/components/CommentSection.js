// file: frontend/src/components/CommentSection.js
'use client';
import { useState } from 'react';
import useUserStore from '@/store/userStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { formatDistanceToNowStrict } from 'date-fns';
import { X } from 'lucide-react'; // Import the 'X' icon


const formatShortTime = (date) => { /* ... same as before ... */ };

export default function CommentSection({ post, initialComments = [] }) {
  const { user } = useUserStore();
  const router = useRouter();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(initialComments);

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post._id}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` },
      });
      if (res.ok) {
        toast.success('Comment deleted');
        router.refresh(); // Refresh data
      } else {
        toast.error('Failed to delete comment.');
      }
    } catch (error) {
      toast.error('An error occurred.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return router.push('/login');
    if (!commentText.trim()) return;

    // --- OPTIMISTIC UI UPDATE ---
    const newComment = {
      _id: Date.now(), // Temporary key
      user: { _id: user._id, name: user.name },
      text: commentText,
      createdAt: new Date().toISOString(),
    };
    setComments([...comments, newComment]);
    setCommentText('');
    // --- END OPTIMISTIC UPDATE ---

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post._id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify({ text: commentText }),
      });
      if (res.ok) {
        toast.success('Comment posted!');
        router.refresh(); // Refresh server data in the background
      } else {
        toast.error('Failed to post comment.');
        setComments(comments); // Revert on failure
      }
    } catch (error) {
      toast.error('An error occurred.');
      setComments(comments); // Revert on failure
    }
  };

  return (
    // ... The rest of your JSX remains the same
   <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Comments ({comments.length})</h2>
      <div className="space-y-4 mb-6">
        {comments.map((comment) => (
          <div key={comment._id} className="p-4 bg-gray-50 rounded-lg relative">
            {/* --- DELETE BUTTON --- */}
            {user && user._id === comment.user._id && (
              <button onClick={() => handleDelete(comment._id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                <X size={16} />
              </button>
            )}
            {/* --- END DELETE BUTTON --- */}
            <div className="flex items-center space-x-3 mb-1">
              <Link href={`/profile/${comment.user._id}`} className="font-semibold text-gray-800 hover:underline">
                @{comment.user.name}
              </Link>
              {/* --- FIXED TIMESTAMP --- */}
              <span className="text-xs text-gray-500">
                {formatShortTime(comment.createdAt)}
              </span>
            </div>
            <p className="text-gray-700">{comment.text}</p>
          </div>
        ))}
      </div>
      {user && (
        <form onSubmit={handleSubmit} className="mt-4">
          <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment..." rows="3" className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm" />
          <button type="submit" className="mt-2 px-4 py-2 font-semibold text-white bg-blue-600 rounded-md">Post Comment</button>
        </form>
      )}
    </div>
  );
}