import type { Task } from "../types";
import { deleteTask, updateTask } from "../api";

interface Props {
  task: Task;
  onUpdate: () => void;
}

const TaskItem: React.FC<Props> = ({ task, onUpdate }) => {
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    await deleteTask(task.id);
    onUpdate();
  };

  const toggleComplete = async () => {
    await updateTask(task.id, {
      title: task.title,
      description: task.description,
      completed: !task.completed,
    });
    onUpdate();
  };

  return (
    <div className="border p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded shadow">
      <div className="flex-1">
        <h2
          className={`text-lg font-semibold ${
            task.completed ? "line-through text-gray-400" : ""
          }`}
        >
          {task.title}
        </h2>
        <p className="text-gray-700 mb-1">{task.description}</p>
        {/* deadline display removed */}
      </div>
      <div className="flex gap-2 mt-2 sm:mt-0">
        <button
          onClick={toggleComplete}
          className={`px-3 py-1 rounded text-white transition ${
            task.completed
              ? "bg-gray-400 hover:bg-gray-500"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {task.completed ? "Undo" : "Done"}
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
