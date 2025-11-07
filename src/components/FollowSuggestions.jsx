import { useEffect, useState } from "react";
import { getSuggestedUsers, toggleFollowUser } from "../api/userApi";

const FollowSuggestions = () => {
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

  const handleFollow = (index) => {
    const updated = [...suggestions];
    updated[index].followed = !updated[index].followed;
    setSuggestions(updated);

    const currentUserId = localStorage.getItem("userId");
    const targetUserId = updated[index]._id; // assuming each suggestion has an _id

    toggleFollowUser(targetUserId, currentUserId)
      .then((res) => {
        console.log("✅ Follow/unfollow success:", res);
         updated[index].followed = !updated[index].followed;
      })
      .catch((error) => {
        // Optionally revert follow state if error occurs
        updated[index].followed = !updated[index].followed;
        setSuggestions(updated);
        console.error("❌ Error toggling follow status:", error);
      });
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow">
      <h3 className="font-semibold mb-2">People You May Know</h3>
      <ul className="space-y-2">
        {suggestions.length > 0 ? (
          suggestions.map((user, i) => (
            <li key={i} className="flex items-center justify-between">
              <span>{user.name}</span>
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
            </li>
          ))
        ) : (
          <li className="text-center text-gray-500 text-sm">No users found.</li>
        )}
      </ul>
    </div>
  );
};

export default FollowSuggestions;
