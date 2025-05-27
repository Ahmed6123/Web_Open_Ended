# 🚀 Full Stack Project

This repository contains both the **React frontend (Vite)** and a **Node.js backend**. Follow the steps below to set up and run the project locally.

---

## 🔧 Prerequisites

- Node.js (v14 or later recommended)
- npm

---

## 🖥️ Frontend Setup

### Steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/your-repo.git
    ```

2. Navigate to the frontend directory:

    ```bash
    cd your-repo/frontend
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Start the development server:

    ```bash
    npm run dev
    ```

The frontend will be running at [http://localhost:5173](http://localhost:5173) (or another available port).

---

## 🛠️ Backend Setup

### Steps:

1. Navigate to the backend directory:

    ```bash
    cd ../backend
    ```

2. Create a `.env` file in the backend directory and add your environment variables.

    Example `.env`:

    ```env
    PORT=5000
    DB_URI=your_database_connection_string
    ```

3. Start the backend server:

    ```bash
    node server.js
    ```

The backend will be running at [http://localhost:5000](http://localhost:5000) (or the port specified in your `.env` file).

---

## ✅ You're All Set!

Both the frontend and backend should now be running locally. Happy coding!
