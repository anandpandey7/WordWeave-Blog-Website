import type { Blog } from "../hooks";
import { Appbar } from "./Appbar";
import { Avatar } from "./BlogCard";
import { Link, useNavigate } from "react-router-dom";
import { getLoggedInUserId } from "../utils/auth";
import { BACKEND_URL } from "../config";

export const FullBlog = ({ blog }: { blog: Blog | null }) => {
  if (!blog) return <p className="text-center py-10">Blog not found</p>;

  // Format the createdAt date
  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const loggedInUserId = getLoggedInUserId();
  const isOwner = loggedInUserId === blog.authorId;

  const navigate = useNavigate();
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (confirmDelete) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/blog/${blog.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
          },
        });
        if (response.ok) {
          alert("Blog deleted successfully!");
          navigate("/blogs"); // Redirect to blogs list after delete
        } else {
          alert("Failed to delete the blog.");
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("An error occurred while deleting the blog.");
      }
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${blog.id}`, { state: { blog } }); // Pass entire blog object
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Appbar />
      <div className="flex justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-screen-2xl pt-8 sm:pt-12">
          {/* Responsive Grid: Stack on mobile, side-by-side on larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-8">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                {blog.title}
              </div>
              <div className="text-slate-500 text-sm sm:text-base mb-6">
                Published on {formattedDate}
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {blog.content}
              </div>
            </div>
            {/* Author Section */}
            <div className="lg:col-span-4">
              
              <Link to={isOwner?`/profile`:`/user/${blog.authorId}`}>
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Author</h3>
                  <div className="flex items-center">
                    <div className="pr-4">
                      <Avatar name={blog.author.name} />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-900">{blog.author.name}</div>
                      <div className="text-sm text-gray-600">Author</div>
                    </div>
                  </div>
                </div>
              </Link>
              {/* Edit and Delete Buttons for Owner */}
                  {isOwner && (
                    <div className="mt-4 flex space-x-2 mb-3">
                      <button
                        onClick={handleEdit}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};