import { useState } from "react";
import { registerUser } from "../api/userApi.js";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext.jsx";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: "",
    coverPicture: "",
  });

  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  // Handle text input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image upload to backend (then Cloudinary)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const name = e.target.name;

    if (!file) return;

    const formDataFile = new FormData();
    formDataFile.append("image", file);

    try {
      setUploading(true);
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formDataFile,
      });

      const data = await res.json();

      if (data.url) {
        setFormData((prev) => ({ ...prev, [name]: data.url }));
        showNotification("success", `${name} uploaded successfully!`);
      } else {
        showNotification("error", "File upload failed!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showNotification("error", "File upload failed!");
    } finally {
      setUploading(false);
    }
  };

  // Handle registration submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.profilePicture || !formData.coverPicture) {
      showNotification("error", "Please upload both images!");
      return;
    }

    try {
      await registerUser(formData);
      showNotification("success", "User registered successfully!");
      navigate("/login");
    } catch (error) {
      showNotification("error", "Registration failed!");
      console.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-[400px]">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            name="email"
            placeholder="Email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            name="password"
            placeholder="Password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Profile Picture Upload */}
          <div className="flex flex-col">
            <label htmlFor="profilePicture" className="mb-1 text-gray-700 font-medium">
              Profile Picture
            </label>
            <input
              id="profilePicture"
              name="profilePicture"
              type="file"
              accept="image/*"
              required
              onChange={handleFileUpload}
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

          {/* Cover Picture Upload */}
          <div className="flex flex-col">
            <label htmlFor="coverPicture" className="mb-1 text-gray-700 font-medium">
              Cover Picture
            </label>
            <input
              id="coverPicture"
              name="coverPicture"
              type="file"
              accept="image/*"
              required
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-700
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-green-50 file:text-green-600
                hover:file:bg-green-100
                cursor-pointer border border-gray-300 rounded-lg p-2
                focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className={`${
              uploading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } text-white font-semibold py-2 rounded-lg shadow transition duration-200`}
          >
            {uploading ? "Uploading..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-5">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
