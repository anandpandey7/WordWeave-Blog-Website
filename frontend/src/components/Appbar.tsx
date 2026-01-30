import { Avatar } from "./BlogCard";
import { Link } from "react-router-dom";

export const Appbar = () => {
  return (
    <div className="border-b flex justify-between items-center px-4 sm:px-6 lg:px-10 py-4">
      <Link to={"/blogs"}>
        <div className="flex flex-col justify-center cursor-pointer text-lg sm:text-xl font-bold">
          WordWeave
        </div>
      </Link>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <Link to={"/publish"}>
          <button
            type="button"
            className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-xs sm:text-sm px-3 sm:px-5 py-2 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 cursor-pointer"
          >
            New
          </button>
        </Link>

        <Link to="/profile">
          <Avatar name="U" />
        </Link>
      </div>
    </div>
  );
};