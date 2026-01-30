import axios from "axios";
import { Appbar } from "../components/Appbar";
import { BACKEND_URL } from "../config";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Publish = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <div>
      <Appbar></Appbar>
      <div>
        <div className="flex justify-center w-full pt-8">
          <div className="max-w-screen-lg w-full px-1">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"></label>
            <input
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Title"
            />
            <TextEditor
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
            <button
              onClick={async () => {
                const response = await axios.post(
                  `${BACKEND_URL}/api/v1/blog`,
                  {
                    title,
                    content,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                navigate(`/blog/${response.data.id}`);
              }}
              type="submit"
              className="pt-4 mr-2.5 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-slate-500 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800 cursor-pointer"
            >
              Draft
            </button>
            <button
              onClick={async () => {
                try {
                    const response = await axios.post(
                    `${BACKEND_URL}/api/v1/blog`,
                    { title, content, published: true },
                    {
                        headers: {
                        Authorization: `Bearer ${token}`,
                        },
                    }
                    );

                    navigate(`/blog/${response.data.id}`);
                } catch (err) {
                    console.error(err);
                }
                }}

              type="submit"
              className="pt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800 cursor-pointer"
            >
              Publish post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function TextEditor({
  onChange,
}: {
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div>
      <form>
        <div className="w-full mt-4 mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
          <div className="py-1 bg-white rounded-b-lg dark:bg-gray-800">
            <label className="sr-only">Publish post</label>
            <textarea
              onChange={onChange}
              id="editor"
              rows={8}
              className="focus:outline-none pl-2 pt-2 block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
              placeholder="Write a blog..."
              required
            ></textarea>
          </div>
        </div>
      </form>
    </div>
  );
}