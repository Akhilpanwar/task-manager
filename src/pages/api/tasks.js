let tasks = [
  {
    id: 1,
    title: "Task 1",
    description: "Description 1",
    priority: "high",
    completed: false,
  },
  {
    id: 2,
    title: "Task 2",
    description: "Description 2",
    priority: "medium",
    completed: false,
  },
  {
    id: 3,
    title: "Task 3",
    description: "Description 3",
    priority: "low",
    completed: true,
  },
  {
    id: 4,
    title: "Task 4",
    description: "Description 4",
    priority: "low",
    completed: true,
  },
];

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json(tasks);
  } else if (req.method === "POST") {
    const { action, id, title, description, priority, completed } = req.body;

    if (action === "add") {
      const newTask = {
        id: tasks.length + 1,
        title,
        description,
        priority,
        completed,
      };
      tasks.push(newTask);

      res.status(201).json({ message: "Task added successfully", tasks });
    } else if (action === "update") {
      tasks = tasks.map((task) =>
        task.id === id
          ? { ...task, title, description, priority, completed }
          : task
      );
      res.status(200).json({ message: "Task updated successfully", tasks });
    } else if (action === "delete") {
      const { id } = req.body;

      tasks = tasks.filter((task) => task.id !== id);
      res.status(200).json({ message: "Task deleted successfully", tasks });
    } else {
      res.status(400).json({ message: "Invalid action" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
