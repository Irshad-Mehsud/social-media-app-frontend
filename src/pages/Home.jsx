import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import ProfileCard from "../components/ProfileCard";
import FriendsList from "../components/FriendsList";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllPosts } from "../api/postApi";

const Home = () => {
  const navigate = useNavigate();
  const handleCreatePost = () => {
    navigate("/create-post");
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  }
  const [posts, setPosts] = useState([]); // ✅ should be an array

  useEffect(() => {
    let ignore = false;

    const fetchPosts = async () => {
      try {
        const postsData = await getAllPosts();
        console.log("✅ Posts data fetched:", postsData.data);

        if (!ignore && postsData.data.length > 0) {
          setPosts(postsData.data); // ✅ store all posts, not just one
        }
      } catch (error) {
        console.error("❌ Error fetching posts:", error);
      }
    };

    fetchPosts();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex justify-between px-6 py-4 gap-4">
        {/* Left Sidebar — User Profile */}
        <aside className="hidden lg:block w-1/5 bg-white p-4 rounded-2xl shadow-sm h-[85vh] overflow-y-auto">
          <ProfileCard />
          <div className="mt-12">
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition" onClick={handleLogout}>
              logout
            </button>
          </div>
        </aside>

        {/* Center — Feed */}
        <main className="flex-1 max-w-2xl mx-auto bg-white p-4 rounded-2xl shadow-sm h-[90vh] flex flex-col">
          <div className="sticky top-0 bg-white z-10 mb-4 flex flex-row gap-2 p-2 shadow-sm rounded-lg">
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              className="w-1/2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              onClick={handleCreatePost}
            >
              Create A Post
            </button>
          </div>

          {/* Scrollable Posts Feed */}
          <div className="no-scrollbar flex-1 overflow-y-auto space-y-4 pr-1">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            ) : (
              <p className="text-center text-gray-500">No posts available</p>
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block w-1/5 bg-white p-4 rounded-2xl shadow-sm h-[85vh] overflow-y-auto no-scrollbar">
          <FriendsList />
        </aside>
      </div>
    </div>
  );
};

export default Home;
