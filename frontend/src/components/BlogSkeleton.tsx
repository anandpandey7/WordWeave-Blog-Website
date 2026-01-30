import { Circle } from "./BlogCard";

export const BlogSkeleton = () => {
  return (
    <div className="border-b border-slate-200 pb-7 w-full max-w-screen-md cursor-pointer animate-pulse">
      <div className="flex">
        <div className="pl-2">
          <div className="h-4  bg-gray-200 rounded-full  w-4 mb-4"></div>
        </div>
        <div className="h-2 bg-gray-200 rounded-full  w-48 mb-4"></div>
        <div className="h-2 bg-gray-200 rounded-full  w-48 mb-4"></div>

        <div className="flex justify-center flex-col pl-2">
          <Circle />
        </div>
        <div className="flex justify-center flex-col pl-2 font-thin text-slate-500 text-sm">
          <div className="h-4  bg-gray-200 rounded-full  w-48 mb-4"></div>
        </div>
      </div>
      <div className="text-xl font-semibold pt-2">
        {" "}
        <div className="h-4  bg-gray-200 rounded-full  w-48 mb-4"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded-full  w-48 mb-4"></div>
    </div>
  );
};