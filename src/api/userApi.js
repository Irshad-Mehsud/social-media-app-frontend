import axiosInstance from "./axiosConfig";

// Register a new user
const registerUser = async (userData) => {
  const { data } = await axiosInstance.post("/auth/register", userData);
  return data; 
};

// Login user
const loginUser = async (credentials) => {
  const { data } = await axiosInstance.post("/auth/login", credentials);
  return data;
};

// Get user profile by ID
const getCurrentUser = async () => {
  const response = await axiosInstance.get("/auth/me");
  return response.data.data; // only return the user object
};

// Get user profile by ID
const getUserById = async (userId) => {
  const response = await axiosInstance.get(`/auth/${userId}`);
  return response.data.data; // assuming backend returns { data: user }
};

// Follow / Unfollow a user
const toggleFollowUser = async (targetUserId, currentUserId) => {
  const { data } = await axiosInstance.put(`/auth/${targetUserId}/follow`, {
   id: currentUserId, // 👈 match backend
  });
  console.log("Follow/unfollow response data:", data);
  console.log("Current User ID:", currentUserId);
  console.log("Target User ID:", targetUserId);
  return data;
};


// Get all suggested users (people you may know)
const getSuggestedUsers = async () => {
  const { data } = await axiosInstance.get("/auth");
  return data;
};

// Update user profile
const updateUserProfile = async (userId, updatedData) => {
  const { data } = await axiosInstance.put(`/users/${userId}`, updatedData);
  return data;
};

export {
  registerUser,
  loginUser,
    getCurrentUser,
    getUserById,
    toggleFollowUser,
    getSuggestedUsers,
    updateUserProfile
};
