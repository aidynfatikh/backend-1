import { useState } from "react";
import { createTask } from "../api";
import type { TaskCreate } from "../types";

interface Props {
  onCreate: () => void;
}

const TaskForm: React.FC<Props> = ({ onCreate }) => {
  const [form, setForm] = useState<TaskCreate>({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      setError("Title is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createTask({
        title: form.title,
        description: form.description,
      });
      setForm({ title: "", description: "" });
      onCreate();
    } catch (err) {
      setError("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 space-y-2 bg-white p-4 rounded shadow"
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          disabled={loading}
        />
        <input
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          disabled={loading}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded transition disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Task"}
        </button>
      </div>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </form>
  );
};

export default TaskForm;
