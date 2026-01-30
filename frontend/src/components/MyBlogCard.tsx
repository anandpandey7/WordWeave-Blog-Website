import { Link } from "react-router-dom";
import { getLoggedInUserId } from "../utils/auth";

interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  authorId: string;
  publishedDate: string;
  id: string;
}

export const MyBlogCard = ({
  id,
  authorName,
  title,
  content,
  authorId,
  publishedDate,
}: BlogCardProps) => {
  const loggedInUserId = getLoggedInUserId();
  const isOwner = loggedInUserId === authorId;
  return (
    <Link to={`/blog/${id}`}>
      <div className="p-4 border-b border-slate-200 pb-4 w-full max-w-screen-md cursor-pointer ">
        <div className="flex">
          <div className="pl-2">
            <Avatar name={authorName} />
          </div>
          <div className="flex justify-center flex-col font-extralight pl-2 text-sm">
              {authorName.toUpperCase()}{" "}
          </div>
          <div className="flex justify-center flex-col pl-2">
            <Circle />
          </div>
          <div className="flex justify-center flex-col pl-2 font-thin text-slate-500 text-sm">
            {publishedDate}
          </div>
        </div>
        <div className="text-xl font-semibold pt-2">{title}</div>
        <div className="text-md font-thin">{content.slice(0, 100) + "..."}</div>
        <div className="text-slate-400 text-sm font-thin pt-4">{`${Math.ceil(
          content.length / 100
        )} minute(s) read`}</div>
      </div>
    </Link>
  );
};

export function Circle() {
  return <div className="h-1 w-1 rounded-full bg-slate-500"></div>;
}

export function Avatar({
  name,
  size = "small",
}: {
  name: string;
  size?: "small" | "big";
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden dark:bg-gray-600 rounded-full ${
        size === "small" ? "w-6 h-6" : "w-10 h-10"
      }`}
    >
      <span
        className={`${
          size === "small" ? "text-xs" : "text-md"
        } font-extralight text-gray-600 dark:text-gray-300`}
      >
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}