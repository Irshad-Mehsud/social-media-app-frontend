import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import ProfileCard from "../components/ProfileCard";
import FriendsList from "../components/FriendsList";

const Home = () => {
  const mockPosts = [
    {
      id: 1,
      user: { name: "Irshad" },
      caption: "Hello World!",
      image: "https://i.dawn.com/primary/2020/12/5fec3217120cc.jpg",
    },
    {
      id: 2,
      user: { name: "Ahsan" },
      caption: "My first post!",
      image: "https://i.dawn.com/primary/2020/12/5fec3217120cc.jpg",
    },

    {
      id: 3,
      user: { name: "Sara" },
      caption: "Enjoying the sunshine.",
      image: "https://i.dawn.com/primary/2020/12/5fec3217120cc.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <Navbar />

      <div className="flex justify-between px-6 py-4 gap-4">
        {/* Left Sidebar — User Profile */}

        <aside className="hidden lg:block w-1/5 bg-white p-4 rounded-2xl shadow-sm h-[85vh] overflow-y-auto">
          <ProfileCard />
        </aside>

        {/* Center — Feed with Search Bar */}
        <main className="flex-1 max-w-2xl mx-auto bg-white p-4 rounded-2xl shadow-sm">
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {mockPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </main>

        {/* Right Sidebar — friend list */}

        <aside className="hidden lg:block w-1/5 bg-white p-4 rounded-2xl shadow-sm h-[85vh] overflow-y-auto no-scrollbar">
          <FriendsList />
        </aside>
      </div>
    </div>
  );
};

export default Home;
