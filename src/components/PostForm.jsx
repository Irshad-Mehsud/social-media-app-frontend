import { useState } from "react";
import { useNotification } from "../context/NotificationContext.jsx";
import { createPost } from "../api/postApi.js";
import { useNavigate } from "react-router-dom";

const PostForm = () => {
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  // ✅ Get user from localStorage (must exist from login/register)

  // ✅ Upload image to backend (then Cloudinary)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.url) {
        setImageUrl(data.url);
        showNotification("success", "✅ Image uploaded successfully!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showNotification("error", "❌ Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Submit post
  const handleSubmit = async (e) => {
    e.preventDefault();
 const userId = localStorage.getItem("userId");

    if (!desc.trim()) {
      showNotification("error", "⚠️ Please enter a description!");
      return;
    }

    if (!userId) {
      showNotification("error", "⚠️ User not logged in!");
      return;
    }

    try {
      const postData = {
        user: userId,
        desc : desc.trim(),
        image: imageUrl || "",
      };
      
      const res = await createPost(postData);
       console.log("Create post response:", postData.desc);
      if (res && !res.error) {
        showNotification("success", "✅ Post created successfully!");
        setDesc("");
        setImageUrl("");
        navigate("/");
      } else {
        showNotification("error", res?.error || "❌ Failed to create post!");
      }
    } catch (error) {
      console.error("Post creation error:", error);
      showNotification("error", "❌ Failed to create post!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 w-[400px]">
        <h2 className="text-xl font-bold text-center text-blue-600 mb-4">
          Create New Post
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Description */}
          <textarea
            placeholder="What's on your mind?"
            rows="4"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>

          {/* Image Upload */}
          <div className="flex flex-col">
            <label htmlFor="imageUpload" className="text-gray-700 font-medium mb-1">
              Upload Image
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              required
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-700
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-600
                hover:file:bg-blue-100
                cursor-pointer border border-gray-300 rounded-lg p-2
                focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* Image Preview */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="rounded-lg w-full h-64 object-cover border border-gray-200 mt-2"
            />
          )}

          {/* Post Button */}
          <button
            type="submit"
            disabled={uploading}
            className={`${
              uploading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } text-white font-semibold py-2 rounded-lg shadow transition duration-200 w-full`}
          >
            {uploading ? "Uploading..." : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
