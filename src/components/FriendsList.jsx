import { useEffect, useState } from "react";
import { getSuggestedUsers,toggleFollowUser } from "../api/userApi";

const FriendsList = () => {
  const [suggestions, setSuggestions] = useState([]);
  const loggedInUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const usersData = await getSuggestedUsers();
        console.log("✅ Suggested users fetched:", usersData);

        // filter out the logged-in user before setting state
        const filteredUsers = usersData.data.filter(
          (user) => user._id !== loggedInUserId
        );

        setSuggestions(filteredUsers);
      } catch (error) {
        console.error("❌ Error fetching suggested users:", error);
      }
    };

    fetchSuggestions();
  }, [loggedInUserId]);

  // const handleFollow = (index) => {
  //   const updated = [...suggestions];
  //   updated[index].followed = !updated[index].followed;
  //   setSuggestions(updated);
  //   const userId = localStorage.getItem("userId");
  //   toggleFollowUser(userId).catch((error) => {
  //     // updated[index].followed = !updated[index].followed; // revert follow status
  //     console.log(userId);
  //     console.error("❌ Error toggling follow status:", error);
  //   });
  // };

  const handleFollow = (index) => {
  const updated = [...suggestions];
  updated[index].followed = !updated[index].followed;
  setSuggestions(updated);

  const currentUserId = localStorage.getItem("userId");
  const targetUserId = updated[index]._id; // assuming each suggestion has an _id

  toggleFollowUser(targetUserId, currentUserId)
    .then((res) => {
      console.log("✅ Follow/unfollow success:", res);
    })
    .catch((error) => {
      // Optionally revert follow state if error occurs
      updated[index].followed = !updated[index].followed;
      setSuggestions(updated);
      console.error("❌ Error toggling follow status:", error);
    });
};


  return (
    <>
      <h2 className="text-lg font-semibold mb-6 mt-6 text-center">
        People You May Know
      </h2>

      <div className="flex flex-col gap-4">
        {suggestions.length > 0 ? (
          suggestions.map((user, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 border rounded-xl hover:shadow-md transition"
            >
              {/* Left: Profile Image + Info */}
              <div className="flex items-center gap-3">
                <img
                  src={
                    user.profilePicture ||
                    "https://randomuser.me/api/portraits/men/32.jpg"
                  }
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-sm">{user.name}</h3>
                  <p className="text-xs text-gray-500">{user.status}</p>
                </div>
              </div>

              {/* Right: Follow Button */}
              <button
                onClick={() => handleFollow(i)}
                className={`px-3 py-1 text-sm rounded-full font-medium transition ${
                  user.followed
                    ? "bg-gray-200 text-gray-700"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {user.followed ? "Following" : "Follow"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm">No users found.</p>
        )}
      </div>
    </>
  );
};

export default FriendsList;
