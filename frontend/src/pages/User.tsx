import { Appbar } from "../components/Appbar";
import { useUser } from "../hooks/index";
import { useParams } from "react-router-dom";
import { Spinner } from "../components/Spinner";
import { BlogCard } from "../components/BlogCard";

export const User = () => {
  const { id } = useParams();
  
  const { loading, user } = useUser({
    id: id || "f98222ff-9734-4fba-bf95-247cabbc9083",
  });
  
  const posts = user?.posts || [];

  // loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Appbar />
        <div className="h-screen flex flex-col justify-center">
          <div className="flex justify-center">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Appbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Layout: Profile on top for mobile, side for desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile</h3>
              <div className="flex items-center">
                <div className="pr-4">
                  <Avatar name={user?.name || "User"} />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{user?.name || "Anonymous"}</div>
                  <div className="text-sm text-gray-600">User ID: {user?.id}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Section */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Posts by {user?.name || "User"}</h2>
            {posts.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No posts yet.</p>
            ) : (
              <div className="space-y-6">
                {posts.map((blog) => (
                  <BlogCard
                    key={blog.id}
                    id={blog.id}
                    title={blog.title}
                    content={blog.content}
                    authorId={blog.authorId}
                    authorName={blog.author?.name || "Anonymous"}
                    publishedDate={new Date(blog.createdAt).toLocaleDateString('en-US', {
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
      </div>
    </div>
  );
};


export function Avatar({ name }: { name: string }) {
  const parts = name.trim().split(" ");
  const firstInitial = parts[0]?.charAt(0).toUpperCase() || "";
  const secondInitial = parts[1]?.charAt(0).toUpperCase() || "";
  
  return (
    <div className="relative inline-flex items-center justify-center overflow-hidden bg-gray-200 rounded-full w-12 h-12">
      <span className="font-medium text-gray-700 text-lg">
        {firstInitial}{secondInitial}
      </span>
    </div>
  );
}