import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { MdAddBox, MdTask, MdDelete } from "react-icons/md";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import { services } from "@/services/service";

export async function getServerSideProps() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks`);
  const tasks = await res.json();

  return {
    props: {
      tasks,
    },
  };
}

const Home = ({ tasks: initialTasks }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const tasksPerPage = 5;
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState(null);

  const handleDeleteTask = (taskId) => {
    setTaskIdToDelete(taskId);
    setShowDeleteConfirmation(true);
  };
  const handleConfirmDelete = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "delete",
        id: taskIdToDelete,
      }),
    });
    if (res.status === 200) {
      const data = await res.json();
      const updatedTasks = tasks.filter((task) => task.id !== taskIdToDelete);
      setTasks(updatedTasks);
      services.saveTasks(data.tasks);
    }

    setShowDeleteConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };
  useEffect(() => {
    const storedTasks = services.getTasks();

    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      setTasks(initialTasks);
    }
  }, [initialTasks]);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const TableCell = ({ children, className }) => (
    <td className={`tasklist-cell ${className}`}>{children}</td>
  );

  const getRowClassName = (priority) => {
    switch (priority) {
      case "high":
        return "high";
      case "medium":
        return "medium";
      case "low":
        return "low";
      default:
        return "";
    }
  };

  const Pagination = ({ tasksPerPage, totalTasks, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalTasks / tasksPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <nav>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <a
              onClick={() => paginate(currentPage - 1)}
              href="#!"
              className="page-link"
            >
              Previous
            </a>
          </li>
          {pageNumbers.map((number) => (
            <li
              key={number}
              className={`page-item ${currentPage === number ? "active" : ""}`}
            >
              <a
                onClick={() => paginate(number)}
                href="#!"
                className="page-link"
              >
                {number}
              </a>
            </li>
          ))}
          <li
            className={`page-item ${
              currentPage === pageNumbers.length ? "disabled" : ""
            }`}
          >
            <a
              onClick={() => paginate(currentPage + 1)}
              href="#!"
              className="page-link"
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div>
      <h1 className="flex items-center justify-center text-4xl font-bold text-blue-600 mb-8 bg-red-100 p-4 rounded-lg">
        <MdTask className="mr-2" color="blue" /> Task List
      </h1>
      <div className="flex justify-between p-2 ml-2">
        <Link
          href="/addtask"
          className="flex items-center text-white bg-blue-600 hover:bg-blue-800 py-2 px-4 rounded-lg transition duration-300"
        >
          <MdAddBox size={40} className="mr-1" />
          Add Task
        </Link>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300"
        />
      </div>
      <div className="tasklist-container">
        <table className="tasklist-table">
          <thead>
            <tr className="tasklist-header">
              <TableCell>Id</TableCell>
              <TableCell>Title </TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </thead>
          <tbody>
            {currentTasks.length > 0 ? (
              currentTasks.map((task) => (
                <tr
                  key={task.id}
                  className={`tasklist-row ${getRowClassName(task.priority)}`}
                >
                  <TableCell>{task.id}.</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>
                    {task.completed ? (
                      <span className="completed">Completed</span>
                    ) : (
                      <span className="pending">Pending</span>
                    )}
                  </TableCell>
                  <TableCell className="action-cell">
                    <FaEdit
                      onClick={() => router.push(`/edit-task/${task.id}`)}
                      className="edit-icon"
                      color={"brown"}
                      size={20}
                    />
                    /
                    <MdDelete
                      onClick={() => handleDeleteTask(task.id)}
                      className="delete-icon"
                      color={"red"}
                      size={20}
                    />
                  </TableCell>
                </tr>
              ))
            ) : (
              <tr>
                <TableCell colSpan="6" className="empty-message">
                  No tasks available
                </TableCell>
              </tr>
            )}
          </tbody>
          {showDeleteConfirmation && (
            <div className="delete-confirmation-popup">
              <p>Are you sure you want to delete task {taskIdToDelete}?</p>
              <button onClick={handleConfirmDelete}>Yes, delete</button>
              <button onClick={handleCancelDelete}>No, cancel</button>
            </div>
          )}
        </table>
        <Pagination
          tasksPerPage={tasksPerPage}
          totalTasks={filteredTasks.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default Home;
