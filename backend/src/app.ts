import express from "express";
import cors from "cors";
import { env } from "./utils/env.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        origin:env.cors_origin,
        credentials:true
    } 
    )
);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

//routers

import userRoute from "./routers/user.routes.js";
import { onboardRoute } from "./routers/onboarding.routes.js";
import { tasksRoute } from "./routers/tasks.routes.js";
import { workspaceRoute } from "./routers/workspace.route.js";

app.use('/api/v1/users',userRoute);
app.use('/api/v1/workspace/onboard',onboardRoute)
app.use('/api/v1/workspace/:workspaceId/tasks',tasksRoute)
app.use('/api/v1/workspace/:workspaceId',workspaceRoute)
export default app;