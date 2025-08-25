// file: frontend/src/app/profile/[id]/page.js
export default function ProfilePage({ params }) {
  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold">User Profile Page</h1>
      <p className="mt-4">This page is for user with ID: {params.id}</p>
      <p className="mt-2 text-gray-600">(Content to be built later)</p>
    </div>
  );
}