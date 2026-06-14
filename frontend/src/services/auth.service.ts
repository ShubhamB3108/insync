
import { api } from "./api.js";

export interface RegisterBody {

    firstName:string,
    lastName:string,
    email:string,
    password:string,
    confirmPassword:string

}

export interface LoginBody{
    email:string,
    password:string
}

export interface User{
    _id:string,
    firstName:string,
    email:string
    onBoarded:boolean
}

export interface AuthResponse{
    success:boolean,
    message:string
    data:{
        user:User,
        userAccessToken:string,
        userRefreshToken:string
    }
}

export interface RegisterRes{
    success:boolean;
    message:string;
    data:User;
}
export const registerUser = async (data:RegisterBody) : Promise<RegisterRes> => {
    const response = await api.post<RegisterRes>(`/users/register`,data);
    
    return response.data

}

export const loginUser = async (data:LoginBody) : Promise<AuthResponse> => {
    
    const response = await api.post<AuthResponse>(`/users/login`,data);
    
    return response.data
}
