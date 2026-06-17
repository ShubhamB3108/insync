import dotenv from 'dotenv'

dotenv.config(

);


export const env = {
    port: Number(process.env.PORT) ||  3001,
    mongo_url : process.env.MONGO_URL || "",
    access_token_secret : process.env.ACCESS_TOKEN_SECRET || "",
    refresh_token_secret : process.env.REFRESH_TOKEN_SECRET || "",
    cors_origin : process.env.CORS_ORIGIN || "",
}