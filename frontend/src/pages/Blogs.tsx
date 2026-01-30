import { BlogCard } from "../components/BlogCard";
import { Appbar } from "../components/Appbar";
import { useBlogs } from "../hooks/index";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

export const Blogs = () => {
  const { blogs, loading, hasMore, fetchBlogs } = useBlogs(10);

  const navigate = useNavigate();
    useEffect(() => {
      // FIXED with the help of multi modal model
      const token = localStorage.getItem("token");

      // CASE 1: No token at all
      if (!token) {
          navigate("/signin");
          return;
      }

      // CASE 2: Token exists, verify it
      axios
          .get(`${BACKEND_URL}/api/v1/user/verifyToken`, {
              headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
              // If backend returns success: false, redirect
              if (!response.data.success) {
                  navigate("/signin");
              }
          })
          .catch(() => {
              // If request fails (e.g., 401 Unauthorized), clean up and redirect
              localStorage.removeItem("token");
              navigate("/signin");
          });
  }, [navigate]);

  if (loading && blogs.length === 0) {
    return (
      <div>
        <Appbar />
        <div className="max-w-3xl mx-auto mt-6 pb-5">
          <BlogSkeleton />
          <BlogSkeleton />
          <BlogSkeleton />
          <BlogSkeleton />
          <BlogSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Appbar />
      <div className="max-w-3xl mx-auto mt-6">
        {blogs.map((blog) => (
          <BlogCard
            key={blog.id}
            id={blog.id}
            title={blog.title}
            content={blog.content}
            authorId={blog.authorId}
            authorName={blog.author.name || "Anonymous"}
            publishedDate={new Date(blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          />
        ))}

        {/* Load More */}
        <div className="flex justify-center my-6">
          {hasMore ? (
            <button
              onClick={fetchBlogs}
              disabled={loading}
              className="px-6 py-2 border rounded"
            >
              {loading ? "Loading..." : "Load more"}
            </button>
          ) : (
            <p className="text-gray-500">No more posts 🚀</p>
          )}
        </div>
      </div>
    </div>
  );
};
