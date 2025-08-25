// file: frontend/src/components/PostCard.js
import Link from 'next/link';
import Image from 'next/image';
import PostActions from './PostActions';

const PostCard = ({ post }) => {
    console.log('2. POSTCARD RECEIVED:', post);
  // Create a "safe" version of the post object to prevent crashes
  const safePost = {
    ...post,
    likes: post.likes || [], // If post.likes is missing, use an empty array
    comments: post.comments || [], // If post.comments is missing, use an empty array
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg flex flex-col h-full">
      <Link href={`/post/${safePost._id}`} className="block">
        <div className="relative w-full h-48">
          <Image 
            src={safePost.coverImage || '/images/placeholder.jpg'} 
            alt={safePost.title} 
            layout="fill" 
            objectFit="cover" 
          />
        </div>
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <Link href={`/post/${safePost._id}`}>
          <h2 className="text-2xl font-bold mb-2 text-gray-800 line-clamp-2 hover:text-blue-600">{safePost.title}</h2>
        </Link>
        <p className="text-gray-600 line-clamp-3 flex-grow">{safePost.content}</p>
        <div className="mt-4 pt-4 border-t flex justify-between items-center">
          <span className="text-xs text-gray-500">
            By {safePost.user ? safePost.user.name : 'Author'}
          </span>
          {/* Pass the safe version of the post down to the next component */}
          <PostActions post={safePost} />
        </div>
      </div>
    </div>
  );
};

export default PostCard;