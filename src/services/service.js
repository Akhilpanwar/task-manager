export const services = {
  getTasks() {
    return localStorage.getItem("tasks");
  },
  saveTasks(data) {
    localStorage.setItem("tasks", JSON.stringify(data));
  },
};
