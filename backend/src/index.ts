import app from "./app.js";
import { env } from "./utils/env.js"
import { connectToDb } from "./config/db.js";
import {Server} from 'socket.io'
import http from 'http'
import { logger } from "./utils/logger.js";

const server = http.createServer(app)

export const io = new Server(server,{
    cors:{
        origin: env.cors_origin,
        credentials:true
    }
})

io.on("connection",(socket)=>{
    logger.info(`User connected: ${socket.id}`);

    socket.on("join-workspace",(workspaceId:string)=>{
        socket.join(workspaceId)
    })
    
    socket.on("disconnect",()=>{
        logger.info(`User disconnected: ${socket.id}`)
    })
})

const startServer = async () => {
  try {
    await connectToDb();

    server.listen(env.port, () => {
      logger.info(`Server is running on ${env.port}`);
    });
  } catch (error) {
    logger.error("Failed to start server");
  }
};

startServer();