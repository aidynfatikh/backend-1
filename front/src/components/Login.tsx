import { useState } from "react";
import { login } from "../api";
import type { UserLogin } from "../types";

const Login = ({
  onLogin,
  onSwitchToSignup,
}: {
  onLogin: () => void;
  onSwitchToSignup: () => void;
}) => {
  const [form, setForm] = useState<UserLogin>({ username: "", password: "" });
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
      const token = await login(form);
      localStorage.setItem("token", token.access_token);
      onLogin();
    } catch (err) {
      setError("Invalid username or password");
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
        Login
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
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-2"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      <div className="text-center">
        <button
          type="button"
          className="text-blue-600 underline"
          onClick={onSwitchToSignup}
        >
          Don't have an account? Sign up
        </button>
      </div>
    </form>
  );
};

export default Login;
