import { useState } from "react";
import { useNotification } from "../context/NotificationContext.jsx";
import { createPost } from "../api/postApi.js";
import { useNavigate } from "react-router-dom";

const PostForm = () => {
  const [desc, setDesc] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [uploading, setUploading] = useState(false);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  // Upload image or video
  const handleMediaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMediaType(file.type.startsWith("video") ? "video" : "image");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.url) {
        setMediaUrl(data.url);
        showNotification("success", "Uploaded successfully!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showNotification("error", "Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  // Submit post
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    if (!desc.trim()) {
      showNotification("error", "Enter a description!");
      return;
    }

    if (!mediaUrl) {
      showNotification("error", "Upload an image or video!");
      return;
    }

    try {
      const postData = {
        user: userId,
        desc: desc.trim(),
        mediaUrl,
        mediaType,
      };

      const res = await createPost(postData);

      if (res && !res.error) {
        showNotification("success", "Post created successfully!");
        setDesc("");
        setMediaUrl("");
        navigate("/");
      } else {
        showNotification("error", res?.error || "Failed to create post!");
      }
    } catch (error) {
      console.error("Post creation error:", error);
      showNotification("error", "Failed to create post!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-2xl shadow-md w-[400px]">
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
            className="w-full p-3 border border-gray-300 rounded-lg"
          ></textarea>

          {/* Image/Video Upload */}
          <div className="flex flex-col">
            <label htmlFor="mediaUpload" className="text-gray-700 font-medium mb-1">
              Upload Image or Video
            </label>
            <input
              id="mediaUpload"
              type="file"
              accept="image/*,video/*"
              required
              onChange={handleMediaUpload}
              className="block w-full text-sm text-gray-700 border p-2 rounded-lg"
            />
          </div>

          {/* Preview */}
          {mediaUrl && (
            <>
              {mediaType === "image" ? (
                <img
                  src={mediaUrl}
                  alt="Preview"
                  className="rounded-lg w-full h-64 object-cover border"
                />
              ) : (
                <video
                  src={mediaUrl}
                  controls
                  className="rounded-lg w-full h-64 border"
                />
              )}
            </>
          )}

          <button
            type="submit"
            disabled={uploading}
            className={`${
              uploading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } text-white font-semibold py-2 rounded-lg w-full`}
          >
            {uploading ? "Uploading..." : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
