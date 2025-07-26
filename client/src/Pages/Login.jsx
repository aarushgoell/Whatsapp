import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const Login = () => {
  const { login } = useAuth(); // to save JWT
  const navigate = useNavigate();

  // 1️⃣ State for form input
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // 2️⃣ Update form state on typing
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 3️⃣ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 4️⃣ Send login request
      const res = await axios.post(`${API_BASE_URL}/api/login`, form);

      // 5️⃣ Save token globally
      login(res.data.token);

      // 6️⃣ Redirect to chat
      navigate("/chat");
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-20 p-4 space-y-4 border rounded"
    >
      <h2 className="text-2xl font-bold text-center">Login</h2>

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded"
      >
        Login
      </button>

      <p className="text-sm text-center">
        Don’t have an account?{" "}
        <a href="/signup" className="text-blue-600 underline">
          Signup
        </a>
      </p>
    </form>
  );
};

export default Login;
