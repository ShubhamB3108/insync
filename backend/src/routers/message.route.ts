import { Router } from "express"
import { isWorkspaceMember, verifyJWT } from "../middlewares/auth.middleware.js"
import { createMessage, deleteMessage, getMessages, updateMessage } from "../controllers/chat.controller.js"

export const messageRoute = Router({mergeParams:true})

messageRoute.route('/create-message').post(verifyJWT,isWorkspaceMember,createMessage)
messageRoute.route('/get-messages').get(verifyJWT,isWorkspaceMember,getMessages)
messageRoute.route('/delete-message').post(verifyJWT,isWorkspaceMember,deleteMessage)
messageRoute.route('/update-message').post(verifyJWT,isWorkspaceMember,updateMessage)