import Landingpage from "./pages/Landinpage"
import Login from "./pages/Login"
import { Route, Routes } from "react-router-dom"
import Signup from "./pages/Signup"
import Onboarding from "./pages/Onboarding"
import CreateWorkspace from "./pages/Createworkspace"
import JoinWorkspace from "./pages/Joinworkspace"
import Workspace from "./pages/Workspace"
import Tasks from "./components/Tasks/Tasks"
// import { Whiteboard } from "./components/Whiteboard"
// import { Chat } from "./components/Chat"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landingpage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/create-workspace" element={<CreateWorkspace />} />
      <Route path="/join-workspace" element={<JoinWorkspace />} />
      
      <Route path="/workspace/:workspaceId" element={<Workspace />}>
        {/* 1. Matches basic "/workspace/tasks" 
          2. Matches dynamic sub-paths like "/workspace/tasks/active" and "/workspace/tasks/completed"
        */}
        
        <Route path="tasks/:tab?" element={<Tasks />} />
      </Route>
    </Routes>
  )
}

export default App