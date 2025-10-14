import { useState } from "react";

const FriendsList = () => {
  const [suggestions, setSuggestions] = useState([
    {
      name: "Ali Khan",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
      status: "Web Developer",
      followed: false,
    },
    {
      name: "Sara Ahmed",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
      status: "UI/UX Designer",
      followed: false,
    },
     {
      name: "Sara Ahmed",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
      status: "UI/UX Designer",
      followed: false,
    },
     {
      name: "Sara Ahmed",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
      status: "UI/UX Designer",
      followed: false,
    },
    {
      name: "Hamza Malik",
      img: "https://randomuser.me/api/portraits/men/55.jpg",
      status: "Photographer",
      followed: false,
    },
    {
      name: "Ayesha Noor",
      img: "https://randomuser.me/api/portraits/women/68.jpg",
      status: "Software Engineer",
      followed: false,
    },
  ]);

  const handleFollow = (index) => {
    const updated = [...suggestions];
    updated[index].followed = !updated[index].followed;
    setSuggestions(updated);
  };

  return (
    // <div className="bg-white rounded-2xl shadow-md p-4">
    <>
      <h2 className="text-lg font-semibold mb-6 mt-6 text-center">People You May Know</h2>

      <div className="flex flex-col gap-4">
        {suggestions.map((user, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 border rounded-xl hover:shadow-md transition"
          >
            {/* Left: Profile Image + Info */}
            <div className="flex items-center gap-3">
              <img
                src={user.img}
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
        ))}
      </div>
      </>
    // </div>
  );
};

export default FriendsList;
