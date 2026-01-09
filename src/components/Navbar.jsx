import React, { useEffect, useState, useRef } from "react";
import { getCurrentUser, getUserById } from "../api/userApi";
import { useParams, useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [currentUserId, setCurrentUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return;

        setCurrentUserId(currentUser._id);

        const profileUser = userId
          ? await getUserById(userId)
          : currentUser;

        setUser(profileUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [userId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white shadow-md py-4 px-8 flex items-center justify-between relative">
      {/* LEFT — Profile Button */}
      <button
        onClick={() => navigate(`/profile/${currentUserId}`)}
        className="text-gray-700 font-medium hover:text-blue-600 transition"
      >
        Profile
      </button>

      {/* CENTER — App Name */}
      <h1
        className="text-2xl font-bold text-blue-600 cursor-pointer"
        onClick={() => navigate("/")}
      >
        SocialApp
      </h1>

      {/* RIGHT — Profile Image Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <img
          src={
            user?.profilePicture ||
            "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=800&q=60"
          }
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover cursor-pointer border-2 border-blue-500"
          onClick={() => setIsOpen((prev) => !prev)}
        />

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-slideDown">
            {/* User Info */}
            <div className="flex items-center p-4 bg-blue-50">
              <img
                src={user?.profilePicture || "https://via.placeholder.com/80"}
                alt="User"
                className="w-14 h-14 rounded-full object-cover border-2 border-blue-400"
              />
              <div className="ml-4">
                <h3 className="font-semibold text-gray-800">{user?.name}</h3>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>

            {/* Actions */}
            <ul className="py-2">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                onClick={() => {
                  navigate(`/profile/${currentUserId}`);
                  setIsOpen(false);
                }}
              >
                <AccountCircleIcon className="text-blue-600" />
                View Profile
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-red-500"
                onClick={handleLogout}
              >
                <LogoutIcon />
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
