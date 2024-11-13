import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import fs from "fs"
const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
   
}))

// Setting Configuration

app.use(express.json(({ limit: '16kb' })))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static( "public"))
app.use(cookieParser())

import UserRouter from "./routes/user.routes.js"

app.use("/api/v1/users", UserRouter)


export {app}