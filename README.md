# 🚀 inSync

inSync is a collaborative workspace platform designed to help teams work together in real time. It combines task management, collaborative whiteboards, team chat, and AI-powered assistance into a single workspace.

## ✨ Features

### 🏢 Workspace Management
- Create and join workspaces
- Unique workspace URLs
- Workspace-based access control

### ✅ Task Management
- Create tasks inside a workspace
- Mark tasks as completed/incomplete
- Delete tasks

### 🎨 Collaborative Whiteboard
- Powered by Excalidraw
- Create multiple boards per workspace
- Whiteboard templates:
  - Flowcharts
  - Mind Maps
  - Kanban Boards
  - Wireframes
  - Brainstorm Boards

### 💬 Team Chat
- Real-time messaging using Socket.io
- Workspace-specific chat rooms
- Message history
- Instant message delivery

### 🔐 Authentication & Security
- JWT Authentication
- Access & Refresh Tokens
- Protected Routes
- Workspace Membership Validation

---

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Socket.io Client
- Excalidraw

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB Atlas
- Mongoose
- Socket.io
- JWT Authentication

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## 📂 Project Structure

```bash
inSync/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── routes/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── socket/
│
└── README.md
## ⚙️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/inSync.git
cd inSync
```

---

### 2️⃣ Setup Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_BASE_URL=http://localhost:3000/api/v1
VITE_SOCKET_URL=http://localhost:3000
```

Start the development server:

```bash
npm run dev
```

Frontend will be available at:

```text
http://localhost:5173
```

---

### 3️⃣ Setup Backend

Open a new terminal and navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=3000

MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CORS_ORIGIN=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

Backend will be available at:

```text
http://localhost:3000
```

---

### 4️⃣ MongoDB Setup

Create a cluster in MongoDB Atlas.

Add your IP address to the Network Access list.

Create a database user.

Copy the connection string and replace:

```env
MONGODB_URI=your_mongodb_connection_string
```

Example:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inSync
```

---

### 5️⃣ Run the Application

Start Backend:

```bash
cd backend
npm run dev
```

Start Frontend:

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

---

### ✅ Default Workflow

1. Register a new account
2. Create or Join a Workspace
3. Create Tasks
4. Start Team Chat
5. Create Whiteboards
6. Collaborate in Real Time

---

### 🛠 Build for Production

#### Frontend

```bash
npm run build
```

#### Backend

```bash
npm run build
npm start
```
# 🔌 API Endpoints

Base URL

```text
http://localhost:3000/api/v1
```

---

# 🔐 Authentication

### Register User

```http
POST /users/register
```

#### Body

```json
{
  "firstName": "Shubham",
  "lastName": "Biswal",
  "email": "shubham@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

---

### Login User

```http
POST /users/login
```

#### Body

```json
{
  "email": "shubham@example.com",
  "password": "password123"
}
```

---

### Get Current User

```http
GET /users/user-details
```

---

### Logout User

```http
POST /workspace/:workspaceId/logout
```

---

# 🏢 Workspace & Onboarding

### Check Workspace URL Availability

```http
POST /workspace/onboard/url-available
```

#### Body

```json
{
  "url": "my-workspace"
}
```

---

### Create Workspace

```http
POST /workspace/onboard/create-workspace
```

#### Body

```json
{
  "name": "My Workspace",
  "workspaceId": "my-workspace",
  "workspaceType": "team",
  "description": "Workspace description"
}
```

---

### Complete Onboarding

```http
GET /workspace/onboard/toggleOnBoard-status
```

---

### Join Workspace

```http
POST /workspace/onboard/join-workspace
```

#### Body

```json
{
  "workspaceId": "my-workspace"
}
```

---

### Get Workspace Name

```http
POST /workspace/:workspaceId/get-name
```

---

### Get Workspace Members

```http
POST /workspace/:workspaceId/get-members
```

---

# ✅ Tasks

### Create Task

```http
POST /workspace/:workspaceId/tasks/create-task
```

#### Body

```json
{
  "task": "Implement authentication",
  "description": "Add JWT authentication flow"
}
```

---

### Get Tasks

```http
GET /workspace/:workspaceId/tasks/get-tasks
```

---

### Toggle Task Status

```http
PATCH /workspace/:workspaceId/tasks/toggle/:taskId
```

---

### Delete Task

```http
DELETE /workspace/:workspaceId/tasks/delete/:taskId
```

---

# 💬 Chat

### Create Message

```http
POST /workspace/:workspaceId/chat/create-message
```

#### Body

```json
{
  "message": "Hello team!",
  "workspaceId": "workspace-id"
}
```

---

### Get Messages

```http
GET /workspace/:workspaceId/chat/get-messages
```

---

### Update Message

```http
POST /workspace/:workspaceId/chat/update-message
```

#### Body

```json
{
  "id": "message-id",
  "newMessage": "Updated message",
  "workspaceId": "workspace-id"
}
```

---

### Delete Message

```http
POST /workspace/:workspaceId/chat/delete-message
```

#### Body

```json
{
  "id": "message-id",
  "workspaceId": "workspace-id"
}
```

---

# 🎨 Whiteboards

### Create Whiteboard

```http
POST /workspace/:workspaceId/whiteboard/create-board
```

#### Body

```json
{
  "title": "System Design",
  "type": "flowchart",
  "workspaceId": "workspace-id"
}
```

---

### Get Workspace Whiteboards

```http
GET /workspace/:workspaceId/whiteboard/get-boards
```

---

### Get Whiteboard

```http
GET /workspace/:workspaceId/whiteboard/:whiteboardId
```

---

### Update Whiteboard

```http
PUT /workspace/:workspaceId/whiteboard/:whiteboardId
```

#### Body

```json
{
  "scene": {
    "elements": [],
    "appState": {}
  }
}
```

---

### Delete Whiteboard

```http
DELETE /workspace/:workspaceId/whiteboard/:whiteboardId
```

---

# 🔒 Authentication

Protected routes require a valid JWT token.

#### Header

```text
Authorization: Bearer <access_token>
```

---

# ⚡ Real-Time Features

Socket.io powers:

* Real-time team chat
---

# 📦 Standard Response Format

### Success

```json
{
  "success": true,
  "message": "Operation Successful",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Something went wrong"
}
```


```json
{
  "success": false,
  "message": "Something went wrong"
}
```
