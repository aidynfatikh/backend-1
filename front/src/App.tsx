import React, { useEffect, useState } from "react";
import type { Task } from "./types";
import { getTasks } from "./api";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Chatbox from "./components/Chatbox";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [showSignup, setShowSignup] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadTasks();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setTasks([]);
  };

  if (!isAuthenticated) {
    if (showSignup) {
      return (
        <Signup
          onSignup={handleLogin}
          onSwitchToLogin={() => setShowSignup(false)}
        />
      );
    }
    return (
      <Login
        onLogin={handleLogin}
        onSwitchToSignup={() => setShowSignup(true)}
      />
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-blue-700 drop-shadow">
            📝 To-Do List
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowChat(!showChat)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              {showChat ? "Show To-Do" : "Chat with AI"}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
      </div>
      {showChat ? (
        <Chatbox />
      ) : (
        <>
          <TaskForm onCreate={loadTasks} />
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <svg
                className="animate-spin h-8 w-8 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : (
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="text-gray-400 text-center py-8">
                  No tasks yet. Add your first task!
                </div>
              ) : (
                tasks.map((task) => (
                  <TaskItem key={task.id} task={task} onUpdate={loadTasks} />
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
