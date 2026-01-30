// New Learning const blog = location.state?.blog as FullBlog | undefined;

import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../config";
import { type UpdateBlogInput, updateBlogInput } from "@anandcse/blog-common";

type FullBlog = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  createdAt: string;
  author: {
    name: string | null;
  };
};

export const EditBlog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Get blog from location.state
  const blog = location.state?.blog as FullBlog | undefined;

  const [title, setTitle] = useState(blog?.title || "");
  const [content, setContent] = useState(blog?.content || "");
  const [published, setPublished] = useState(blog?.published || false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!blog) {
      navigate("/blogs"); // Redirect if no blog data
    }
  }, [blog, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const body = { id, title, content, published };
    const parseResult = updateBlogInput.safeParse(body);
    if (!parseResult.success) {
      alert("Invalid input");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/blog`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        alert("Blog updated successfully!");
        navigate(`/blog/${blog?.id || id}`);
      } else {
        alert("Failed to update the blog.");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("An error occurred while updating the blog.");
    } finally {
      setLoading(false);
    }
  };

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-3 sm:p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Blog</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="published" className="text-sm font-medium text-gray-700">
              {published ? "Unpublish" : "Publish"} this blog
            </label>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-1 sm:px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Blog"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-1 sm:px-4 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};