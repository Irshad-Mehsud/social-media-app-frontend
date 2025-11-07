// import {axiosInstance} from "../api/userApi.js";
import { getCurrentUser, getUserById, toggleFollowUser} from "../api/userApi.js";
import {getAllPosts} from "../api/postApi.js";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProfileCard = () => {
  const { userId } = useParams(); // Get userId from URL params if viewing another user's profile
  const [user, setUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
const [posts, setPosts] = useState([]);
const [myPosts, setMyPosts] = useState([]);

useEffect(() => {
  const fetchPosts = async () => {
    try {
      const res = await getAllPosts();
      const allPosts = res.data; 
      setPosts(allPosts);

      const currentUserId = localStorage.getItem("userId");

      // ✅ Handles both populated and unpopulated cases
      const filtered = allPosts.filter(
        (post) =>
          post.user === currentUserId ||
          post.user?._id === currentUserId
      );

      setMyPosts(filtered);

      console.log("✅ Total Posts:", allPosts.length);
      console.log("👤 Current User Posts:", filtered.length);
    } catch (error) {
      console.error("❌ Error fetching posts:", error);
    }
  };

  fetchPosts();
}, []);




  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setCurrentUserId(currentUser._id);

        let profileUser;
        if (userId) {
          profileUser = await getUserById(userId);
        } else {
          profileUser = currentUser;
        }
        setUser(profileUser);

        // Check if current user is following this profile user
        if (userId && currentUser.following) {
          setIsFollowing(currentUser.following.includes(userId));
        }

        console.log("Fetched user:", profileUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [userId]);


  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full">
      {/* Cover Image */}
      <div className="relative">
        <img
          src={user?.coverPicture || "https://images.unsplash.com/photo-1503264116251-35a269479413?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y292ZXIlMjBwaWN0dXJlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"}
          alt="Cover"
          className="w-full h-28 object-cover"
        />

        {/* Profile Image */}
        <img
          src={user?.profilePicture || "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=1024x1024&w=is&k=20&c=oGqYHhfkz_ifeE6-dID6aM7bLz38C6vQTy1YcbgZfx8="}
          alt="Profile"
          className="absolute left-1/2 transform -translate-x-1/2 -bottom-10 w-24 h-24 rounded-full border-4 border-white object-cover"
        />
      </div>

      {/* User Info */}
      <div className="mt-12 text-center px-4 pb-4">
        <h2 className="font-semibold text-lg">{user?.name}</h2>
        <p className="text-gray-500 text-sm">Web Developer • React & MUI Expert</p>

        {/* Bio */}
        <p className="text-gray-600 text-sm mt-3">
          Passionate front-end developer crafting clean, interactive, and
          responsive user interfaces with React, Tailwind, and Material UI.
        </p>

        {/* Stats */}
        <div className="flex justify-around mt-4 text-sm text-gray-700">
          <div>
            <span className="font-bold block text-lg">{user?.followers?.length || 0}</span>
            Followers
          </div>
          <div>
            <span className="font-bold block text-lg">{user?.following?.length || 0}</span>
            Following
          </div>
          <div>
            <span className="font-bold block text-lg">{myPosts.length || 0}</span>
            Posts
          </div>
        </div>

        {/* Follow Button if viewing another user */}
        {userId && userId !== currentUserId && (
          <div className="mt-4">
            <button
              onClick={async () => {
                try {
                  await toggleFollowUser(userId, currentUserId);
                  setIsFollowing(!isFollowing);
                } catch (error) {
                  console.error("Error toggling follow:", error);
                }
              }}
              className={`px-4 py-2 rounded-full font-medium transition ${
                isFollowing
                  ? "bg-gray-200 text-gray-700"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
