import React from "react";
import { updateTask } from "../services/taskService";

const TaskCard = ({ task, refresh }) => {
  const isDone = task.status === "Done";
  const isOverdue =
    !isDone &&
    task.dueDate &&
    new Date(task.dueDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

  const handleToggle = async () => {
    try {
      await updateTask(task._id);
      refresh(); // reload tasks
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="surface-card flex h-full min-h-44 flex-col justify-between p-3 lg:aspect-square">
      <div className="mb-2">
        <div className="mb-1.5 flex flex-wrap items-center gap-1">
          <span
            className={`badge ${
              isDone ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
            }`}
          >
            {task.status}
          </span>
          {isOverdue && <span className="badge bg-rose-100 text-rose-700">Overdue</span>}
        </div>

        <h3 className={`line-clamp-2 text-sm font-semibold ${isDone ? "text-emerald-700 line-through" : "text-slate-900"}`}>
          {task.title}
        </h3>

        <p className="mt-1.5 text-[11px] text-slate-600">
          Assigned to: {task.assignedTo?.name}
        </p>

        <p className="mt-0.5 text-[11px] text-slate-600">
          Project: {task.project?.title || "Unknown project"}
        </p>

        <p className="mt-0.5 text-[11px] text-slate-600">
          Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
        </p>
      </div>

      <button
        onClick={handleToggle}
        className={`mt-auto w-full rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-white transition ${
          isDone ? "bg-emerald-600 hover:bg-emerald-500" : "bg-cyan-700 hover:bg-cyan-600"
        }`}
      >
        {isDone ? "Mark as Pending" : "Mark as Done"}
      </button>
    </div>
  );
};

export default TaskCard;