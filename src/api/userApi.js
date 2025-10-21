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

// Follow / Unfollow a user
const toggleFollowUser = async (userId) => {
  const { data } = await axiosInstance.put(`/users/${userId}/follow`);
  return data;
};

// Get all suggested users (people you may know)
const getSuggestedUsers = async () => {
  const { data } = await axiosInstance.get("/users/suggestions");
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
    toggleFollowUser,
    getSuggestedUsers,
    updateUserProfile
};
