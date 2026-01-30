import { useProfile } from "../hooks/index";
import { useState } from "react";
import { Avatar } from "./User"; 
import { Link } from "react-router-dom"; 
import { MyBlogCard } from "../components/MyBlogCard";

export const Profile = () => {
  
  const { loading, profile } = useProfile();
  const [showPublished, setShowPublished] = useState(true);
  const filteredPosts = profile?.posts?.filter(post => post.published === showPublished) || [];

  // loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center">
            <div className="pr-6">
              <Avatar name={profile?.name || "User"} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile?.name || "Anonymous"}</h1>
              <p className="text-gray-600">{profile?.email}</p>
              <p className="text-sm text-gray-500">User ID: {profile?.id}</p>
            </div>
          </div>
        </div>

        {/* Toggle Buttons to Switch Between Published and Unpublished Posts */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowPublished(true)}
            className={`px-6 py-2 rounded-l-lg font-medium transition-colors ${
              showPublished ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Published Posts
          </button>
          <button
            onClick={() => setShowPublished(false)}
            className={`px-6 py-2 rounded-r-lg font-medium transition-colors ${
              !showPublished ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Unpublished Posts
          </button>
        </div>

        {/* Posts Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {showPublished ? 'Published Posts' : 'Unpublished Posts'}
          </h2>
          {filteredPosts.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No {showPublished ? 'published' : 'unpublished'} posts yet.
            </p>
          ) : (
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <MyBlogCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  content={post.content}
                  authorId={profile?.id}
                  authorName={profile?.name || "Anonymous"}
                  publishedDate={new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Round + Button for Creating Blog */}
      <Link to="/publish">
        <button className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </button>
      </Link>
    </div>
  );
};