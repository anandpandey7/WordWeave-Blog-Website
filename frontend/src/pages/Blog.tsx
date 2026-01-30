import { useBlog } from "../hooks";
import { useParams } from "react-router-dom";
import { FullBlog } from "../components/FullBlog";
import { Spinner } from "../components/Spinner";
import { Appbar } from "../components/Appbar";

export const Blog = () => {
  const { id } = useParams();
  const { loading, blog } = useBlog({
    id: id || "1ec35bf8-41db-4a50-ae4b-13b25bc6e182",
  });

  if (loading) {
    return (
      <div>
        <Appbar />
        <div className="h-screen flex flex-col justify-center">
          <div className="flex justify-center">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  if (!blog) return <div>Blog not found</div>;

  return (
    <div>
      <FullBlog blog={blog}></FullBlog>
    </div>
  );
};