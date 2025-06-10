import { useState } from "react";
import { signup } from "../api";
import type { UserSignup } from "../types";

const Signup = ({
  onSignup,
  onSwitchToLogin,
}: {
  onSignup: () => void;
  onSwitchToLogin: () => void;
}) => {
  const [form, setForm] = useState<UserSignup>({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = await signup(form);
      localStorage.setItem("token", token.access_token);
      onSignup();
    } catch (err) {
      setError("Signup failed. Username may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
        Sign Up
      </h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        className="w-full mb-3 px-3 py-2 border rounded"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full mb-3 px-3 py-2 border rounded"
        required
      />
      {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mb-2"
        disabled={loading}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>
      <div className="text-center">
        <button
          type="button"
          className="text-blue-600 underline"
          onClick={onSwitchToLogin}
        >
          Already have an account? Login
        </button>
      </div>
    </form>
  );
};

export default Signup;
