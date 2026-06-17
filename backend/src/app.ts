import express from "express";
import cors from "cors";
import { env } from "./utils/env.js";
import cookieParser from "cookie-parser";
import { verifyJWT,isWorkspaceMember } from "./middlewares/auth.middleware.js";
const app = express();

app.use(
    cors({
        origin:env.cors_origin,
        credentials:true
    } 
    )
);

app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.use(cookieParser())

//routers

import userRoute from "./routers/user.routes.js";
import { onboardRoute } from "./routers/onboarding.routes.js";
import { tasksRoute } from "./routers/tasks.routes.js";
import { workspaceRoute } from "./routers/workspace.route.js";
import { messageRoute } from "./routers/message.route.js";
import boardRoute from "./routers/whiteboard.route.js";
app.use('/api/v1/users',userRoute);
app.use('/api/v1/workspace/onboard',onboardRoute)
app.use(
  '/api/v1/workspace/:workspaceId',
  verifyJWT,
  isWorkspaceMember
);

app.use('/api/v1/workspace/:workspaceId/tasks',tasksRoute)
app.use('/api/v1/workspace/:workspaceId',workspaceRoute)
app.use('/api/v1/workspace/:workspaceId/chat',messageRoute)
app.use('/api/v1/workspace/:workspaceId/whiteboard',boardRoute)

export default app;