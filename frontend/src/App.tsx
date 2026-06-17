import Landingpage from "./pages/Landinpage"
import Login from "./pages/Login"
import { Route, Routes } from "react-router-dom"
import Signup from "./pages/Signup"
import Onboarding from "./pages/Onboarding"
import CreateWorkspace from "./pages/Createworkspace"
import JoinWorkspace from "./pages/Joinworkspace"
import Workspace from "./pages/Workspace"
import Tasks from "./components/Tasks/Tasks"

import { ChatSection } from "./components/Chat"
import HomeDashboard from "./components/workspace/Home"
import WorkspaceAccessDenied from "./pages/AccessDenied"

import BrowseBoards from "./pages/BrowseBoards"
import Whiteboard from "./components/Whiteboard/WhiteBoard"
import WorkspaceMembers from "./pages/Members"
import { PublicRoute } from "./components/PublicRoute"
import { OnboardingRoute } from "./components/OnBoardingRoute"

function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />} >
          <Route path="/" element={<Landingpage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
      </Route>
      <Route element={<OnboardingRoute />} >
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/create-workspace" element={<CreateWorkspace />} />
      <Route path="/join-workspace" element={<JoinWorkspace />} />
      </ Route>
      <Route path="/workspace/:workspaceId" element={<Workspace />}>
        {/* 1. Matches basic "/workspace/tasks" 
          2. Matches dynamic sub-paths like "/workspace/tasks/active" and "/workspace/tasks/completed"
        */}
        
        <Route path="tasks/:tab?" element={<Tasks />} />
        <Route path="home" element={<HomeDashboard />} />
        <Route path="chat" element={<ChatSection />} />
        <Route path="whiteboard/browse-board" element={<BrowseBoards />} />
        <Route path="whiteboard/:whiteboardId" element={<Whiteboard />}/>
        <Route path="members" element={<WorkspaceMembers />}/>
      </Route>
      <Route path="access-denied" element= {<WorkspaceAccessDenied />} />
      
    </Routes>
  )
}

export default App