import { useState } from "react";
import { registerUser } from "../api/userApi.js";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: "",
    coverPicture: "",
  });
   const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     await registerUser(formData);
      alert("User registered successfully!");
      navigate("/login");

    } catch (error) {
      alert("Registration failed. Please try again.");
      console.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-[400px]">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Create Account</h1>

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
            value={formData.password}
            required
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="profilePicture"
            placeholder="Profile Picture URL"
            value={formData.profilePicture}
            required
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="coverPicture"
            placeholder="Cover Picture URL"
            value={formData.coverPicture}
            required
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow transition duration-200"
          >
            Register
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
