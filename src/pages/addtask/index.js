import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { services } from "@/services/service";

const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  id,
  placeholder,
}) => (
  <div className="form-group">
    <label htmlFor={id} className="form-label">
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        className="form-textarea"
        placeholder={placeholder}
        required
      />
    ) : (
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className="form-input"
        placeholder={placeholder}
        required
      />
    )}
  </div>
);

const SelectField = ({ label, value, onChange, options, id }) => (
  <div className="form-group">
    <label htmlFor={id} className="form-label">
      {label}
    </label>
    <select id={id} value={value} onChange={onChange} className="form-select">
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const AddTask = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTask = {
      ...formData,
      action: "add",
      completed: formData.status === "completed",
    };

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });

    if (response.status === 201) {
      const data = await response.json();
      services.saveTasks(data.tasks);
      router.push("/");
    }
  };

  const priorityOptions = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div className="add-task-container">
      <h1 className="add-task-title">Add New Task</h1>
      <form onSubmit={handleSubmit} className="add-task-form">
        <InputField
          id="title"
          label="Task Title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Task title"
        />
        <InputField
          id="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Task description"
          type="textarea"
        />
        <SelectField
          id="priority"
          label="Priority"
          value={formData.priority}
          onChange={handleChange}
          options={priorityOptions}
        />
        <SelectField
          id="status"
          label="Status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
        />
        <div className="form-actions">
          <button type="submit" className="form-button save-button">
            Add Task
          </button>
          <Link href="/" className="form-button cancel-button">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
