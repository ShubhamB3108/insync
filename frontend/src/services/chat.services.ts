
import { api } from "./api";

interface messageBody{
    message:string,
    workspaceId:string,
}

export interface Message{
    
    _id:string
    message:string,
    senderId:string,
    senderName:string,
    workspaceId:string,
    time:string,
    date:string
}

interface resBody{
    success:boolean,
    message:string,
    data:Message
}

export const createMessage = async (data:messageBody)=>{
        const res = await api.post<resBody>(`/workspace/${data.workspaceId}/chat/create-message`,data)
        
        return res.data.data;
}

export const getMessages  = async (data:{workspaceId:string}) =>{
    const res = await api.get(`/workspace/${data.workspaceId}/chat/get-messages`)

    return res.data;
}

export const deleteMessage = async (data:{workspaceId:string,id:string}) =>{
        const res = await api.post(`/workspace/${data.workspaceId}/chat/delete-message`,data)
        return res
}

export const updateMessage = async (data:{workspaceId:string,id:string,newMessage:string})=>{
    const res = await api.post<resBody>(`/workspace/${data.workspaceId}/chat/update-message`,data)

    return res.data.data
}

