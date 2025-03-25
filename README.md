### **📝 AI-Powered Task Management System**  

An AI-powered task management system that supports real-time updates, user authentication, and intelligent task suggestions using OpenAI/Gemini API. Built with **Golang (Fiber)** for the backend and **Next.js (TypeScript + Tailwind CSS)** for the frontend.

---

## 🚀 **Features**  

- ✅ **User Authentication** – Secure JWT-based login and session management.  
- ✅ **Task Management** – Create, assign, update, and track tasks.  
- ✅ **Real-Time Updates** – WebSockets for live task synchronization.  
- ✅ **AI-Powered Suggestions** – Use OpenAI/Gemini to suggest task breakdowns.  
- ✅ **Modern UI** – Intuitive and responsive task dashboard with Tailwind CSS.  
- ✅ **Cloud Deployment** – Deployed on **Render (backend)** and **Vercel (frontend)**.  

---

## 📂 **Project Structure**  

```
task-management-ai/
├── backend/          # Golang backend (Fiber Framework)
│    ├── api/         # REST API (Auth, Task APIs)
│    ├── internal/    # Business logic (DB, WebSockets)
│    ├── go.mod       # Go module configuration
│    └── main.go      # Entry point for backend
└── frontend/         # Next.js (TypeScript) frontend
     ├── components/  # Reusable UI components
     ├── lib/         # API calls (Axios-based)
     ├── pages/       # Next.js pages (index, auth)
     └── tailwind.config.js
```

---

## 🛠️ **Tech Stack**  

### **Backend:**  
- Go (Fiber Framework)  
- PostgreSQL (or MongoDB)  
- JWT Authentication  
- WebSockets (Gorilla)  
- OpenAI/Gemini API (for AI tasks)  

### **Frontend:**  
- Next.js (TypeScript)  
- Tailwind CSS  
- Axios (API Communication)  
- JWT (Client-side Auth)  
- WebSockets (Real-Time Updates)  

---

## 📌 **Getting Started**  

### 1. **Clone the Repository**  
```bash
git clone https://github.com/Pragya81/task_management_AI.git
cd task-management-ai
```

---

### 2. **Backend Setup**  

```bash
cd backend
go mod tidy
```

#### **Environment Variables (`backend/.env`):**  
```
PORT=8080
DB_URL=your_database_url
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

#### **Run the Backend:**  
```bash
go run main.go
```

---

### 3. **Frontend Setup**  

```bash
cd ../frontend
npm install
```

#### **Environment Variables (`frontend/.env.local`):**  
```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8080/ws
OPENAI_API_KEY=your_openai_api_key
```

#### **Run the Frontend:**  
```bash
npm run dev
```

---

## 🌐 **Deployment Instructions**  

1. **Backend Deployment (Render/Fly.io)**  
   - Set up the backend using Docker or native deployment.  
2. **Frontend Deployment (Vercel)**  
   - Link your frontend to Vercel for a seamless Next.js deployment.  

---

## 📊 **API Endpoints**  

| Method | Endpoint            | Description            | Auth Required |
|--------|---------------------|------------------------|---------------|
| POST   | `/api/auth/register` | Register a new user    |       |
| POST   | `/api/auth/login`    | Login and get a token  |       |
| GET    | `/api/tasks`         | Fetch all tasks        | ✅ Yes        |
| POST   | `/api/tasks`         | Create a new task      | ✅ Yes        |
| PATCH  | `/api/tasks/:id`     | Update a task          | ✅ Yes        |
| DELETE | `/api/tasks/:id`     | Delete a task          | ✅ Yes        |

---

## 🤖 **AI Integration**  

- Uses OpenAI/Gemini API for task suggestions.  
- Automatically suggests subtasks and categorizes them based on priority.

---

## ✅ **To-Do (Future Enhancements)**  

- [ ] Docker & Kubernetes for scalable deployment.  
- [ ] Slack/Discord bot for task notifications.  
- [ ] Automate task prioritization with AI.  
- [ ] Role-based access control (RBAC).  

---

---

## 👩‍💻 **Contributing**  

1. Fork the repo.  
2. Create a feature branch: `git checkout -b feature/new-feature`.  
3. Commit changes: `git commit -m "Add new feature"`.  
4. Push to branch: `git push origin feature/new-feature`.  
5. Open a pull request.  

---
