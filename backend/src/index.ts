import app from "./app.js";
import { env } from "./utils/env.js"
import { connectToDb } from "./config/db.js";

app.listen(env.port , ()=>{
    console.log(`the port is live on ${env.port}`)
})

connectToDb();