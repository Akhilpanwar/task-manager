Task Manager Application
A simple Task Manager built using Next.js, React, and a custom CSS. This app allows users to add, edit, search, and delete tasks. It includes pagination, task filtering, and local storage for persistence.

Features:-

- Add, edit, delete tasks
- Search tasks by title
- Pagination support for tasks
- Task priority and status management (Pending/Completed)
- Custom confirmation prompt for task deletion
- Responsive design with custom CSS
- Local storage persistence

Technologies Used:-

- Next.js - React framework for building server-side and static web applications.
- React - Frontend UI library for building user interfaces.
- [Custom CSS] - Replacing Tailwind CSS for styling.
- Node.js - Backend for running the Next.js server.
- Icons - Used for interactive UI elements.

Getting Started
Prerequisites
Make sure you have the following installed on your machine:

Node.js (v20)
npm or Yarn
Installation
Clone the repository:

git clone https://github.com/akhilpanwar/task-manager.git
Navigate to the project directory:

cd task-manager
Install dependencies:

npm install

# OR

yarn install
Create a .env.local file in the root directory and add the following:

NEXT_PUBLIC_BASE_URL=http://localhost:3000
Running the App
Start the development server:
npm run dev
