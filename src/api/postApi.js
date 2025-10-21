import axios from "axios";

const API_URL = "http://localhost:5000/api/posts";

const createPost = async (postData) => {
  try {
    const res = await axios.post(API_URL, postData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // ✅ important if you’re using JWT cookies
    });

    return res.data; // return only useful data (not full response)
  } catch (error) {
    // ✅ Log full error for debugging
    console.error(
      "createPost error:",
      error.response?.data || error.message || error
    );

    // Rethrow so the frontend can catch it in PostForm
    throw error.response?.data || error;
  }
};

const getAllPosts = async () => {
  try {
    const res = await axios.get(API_URL, {
      withCredentials: true, // ✅ important if you’re using JWT cookies
    });
    return res.data; // return only useful data (not full response)
  } catch (error) {
    // ✅ Log full error for debugging
    console.error(  
      "getAllPosts error:",
      error.response?.data || error.message || error
    );
    // Rethrow so the frontend can catch it
    throw error.response?.data || error;
  }
};



export { 
  createPost,
  getAllPosts
};
