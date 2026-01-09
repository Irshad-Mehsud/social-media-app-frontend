import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import ProfileCard from "../components/ProfileCard";
import StoryCard from "../components/StoryCard";
import StorySlider from "../components/StorySlider";
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
  };
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
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              onClick={handleLogout}
            >
              logout
            </button>
          </div>
        </aside>

        {/* Center — Feed */}
        <main className="flex-1 max-w-2xl mx-auto bg-white p-4 rounded-2xl shadow-sm h-[100vh] flex flex-col">
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

                          {/* <div className="flex justify-center gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar px-2 py-3">
  <StoryCard
    storyImage="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d"
    profileImage="https://randomuser.me/api/portraits/women/1.jpg"
    name="Alice"
  />
  <StoryCard
    storyImage="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
    profileImage="https://randomuser.me/api/portraits/men/2.jpg"
    name="John"
  />
  <StoryCard
    storyImage="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
    profileImage="https://randomuser.me/api/portraits/women/3.jpg"
    name="Sana"
  />
  <StoryCard
    storyImage="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d"
    profileImage="https://randomuser.me/api/portraits/men/4.jpg"
    name="Ali"
  />
  <StoryCard
    storyImage="https://images.unsplash.com/photo-1517841905240-472988babdf9"
    profileImage="https://randomuser.me/api/portraits/women/5.jpg"
    name="Emma"
  />
</div> */}
{/* <!-- Stories Slider Component could go here --> */}
<StorySlider />

 

          {/* Scrollable Posts Feed */}
          <div className="no-scrollbar flex-1 overflow-y-auto space-y-4 pr-1">
            

            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post._id} post={post} setPosts={setPosts} />
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
