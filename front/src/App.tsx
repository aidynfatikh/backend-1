import { useEffect, useState } from "react";
import type { Task } from "./types";
import { getTasks } from "./api";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    loadTasks();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-700 drop-shadow">
        📝 To-Do List
      </h1>
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
    </div>
  );
};

export default App;
