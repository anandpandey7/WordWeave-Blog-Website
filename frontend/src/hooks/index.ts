// import { useEffect, useState } from "react";
// import axios from "axios";
// import { BACKEND_URL } from "../config";

// type Blog = {
//   id: string;
//   title: string;
//   content: string;
//   createdAt: string;
//   author: {
//     name: string;
//   };
// };

// export const useBlogs = () => {
//   const [loading, setLoading] = useState(true);
//   const [blogs, setBlogs] = useState<Blog[]>([]);

//   useEffect(() => {
//     async function fetchBlogs() {
//       try {
//         const res = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk`);
//         setBlogs(res.data.posts);
//       } catch (error) {
//         console.error("Failed to fetch blogs", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchBlogs();
//   }, []); 

//   return { loading, blogs };
// };


// added pagination with the help of multi modal model

import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export type Blog = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  author: {
    name: string | null;
  };
};


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


export type ProfilePost = {
    id: string;
    title: string;
    content: string;
    published: boolean;
    createdAt: string;
};

export type Profile = {
    id: string;
    name: string | null;
    email: string;
    posts: ProfilePost[];
};

export type UserPost = {
    id: string;
    title: string;
    content: string;
    createdAt: string;
};

export type User = {
    id: string;
    name: string | null;
    posts: UserPost[];
}

export const useBlog = ({id}: {id: string}) =>{
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<FullBlog | null>(null);
  
  useEffect(()=>{

    const fetchBlog = async()=>{
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBlog(res.data.post); 
      } catch (error) {
        console.error("Error fetching the blog:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  },[id]);

  return{loading,blog};
}

export const useBlogs = (limit = 10) => {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchBlogs = async () => {
    // Prevent duplicate fetches or fetching when no more data exists
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Token being sent:", token); 
      const res = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newPosts = res.data.posts;
      
      setBlogs((prev) => [...prev, ...newPosts]);
      
      // Check if we've reached the end based on your backend response
      // Ensure your backend sends res.data.pagination.totalPages
      if (page >= res.data.pagination.totalPages || newPosts.length < limit) {
        setHasMore(false);
      }

      setPage((p) => p + 1);
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Trigger the initial load automatically
  useEffect(() => {
    fetchBlogs();
  }, []); 

  return { blogs, loading, hasMore, fetchBlogs };
};

export const useProfile = ()=>{
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async()=>{
    setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BACKEND_URL}/api/v1/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data.profile); 
      } catch (error) {
        console.error("Error fetching the blog:", error);
      } finally {
        setLoading(false);
      }
  }
  useEffect(()=>{
    fetchProfile();
  },[]);

  return {loading, profile};
}

export const useUser = ({id}: {id: string})=>{
  const [user,setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{

    const fetchBlog = async()=>{
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BACKEND_URL}/api/v1/profile/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.profile); 
      } catch (error) {
        console.error("Error fetching the blog:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  },[id]);

  return {loading, user};
}