import { useState } from "react";
// import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const navigate = useNavigate();
    try {
      setLoading(true);
      const res = await axios.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      alert("Login successful!");
      navigate("/");

    } catch (error) {
      alert("Invalid credentials. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-[90%] sm:w-[400px]">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Welcome Back</h1>
        <p className="text-center text-gray-500 mb-6">Login to continue to your account</p>

        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <button
            type="submit"
            disabled={loading}
            className={`py-3 rounded-lg font-semibold text-white transition ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline font-medium">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
