import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { services } from "@/services/service";

export async function getServerSideProps(context) {
  const { slug } = context.params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks`);
  const tasks = await res.json();
  const currentTask = tasks.find((task) => task.id === parseInt(slug));

  if (!currentTask) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      task: currentTask,
    },
  };
}

export default function EditTask({ task }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "update",
        id: task.id,
        ...formData,
        completed: formData.status === "completed",
      }),
    });

    if (response.status === 200) {
      const data = await response.json();
      services.saveTasks(data.tasks);
      router.push("/");
    }
  };

  return (
    <div className="edit-task-container">
      <h1 className="edit-task-title">Edit Task {task.id}</h1>
      <form onSubmit={handleSubmit} className="edit-task-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Task Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            placeholder="Task title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Task description"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="priority" className="form-label">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="form-select"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="status" className="form-label">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-select"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="form-button save-button">
            Save
          </button>
          <Link href="/" className="form-button cancel-button">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
