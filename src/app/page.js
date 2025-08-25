// file: frontend/src/app/page.js
import PostCard from "@/components/PostCard";

// This function runs on the server to fetch our posts
async function getPosts() {
  try {
    const res = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/posts', { 
      cache: 'no-cache' // This ensures we always get the latest posts
    });

    if (!res.ok) {
      throw new Error('Failed to fetch posts');
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return []; // Return an empty array in case of an error
  }
}

// We mark our homepage component as 'async'
export default async function HomePage() {
  const posts = await getPosts();
  console.log('1. HOMEPAGE DATA:', JSON.stringify(posts, null, 2));

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-8">Latest Posts</h1>
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No posts found.</p>
      )}
    </div>
  );
}