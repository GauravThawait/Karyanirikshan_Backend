import express from 'express'
import errorHandler from './middleware/errorHandler.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'


const app = express()

const corsOptions = {
    origin : process.env.CLIENT_URL || '*',
    credentials : true,
    allowedHeaders: ['Content-Type', 'Authorization']
}

//middleware
app.use(express.json())
app.use(cors(corsOptions))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended : true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())



//import routes
import userRouterV1 from './routes/v1/user.routes.js'
import departmentRouterV1 from './routes/v1/department.routes.js'



app.use("/api/v1/user", userRouterV1)
app.use("/api/v1/department", departmentRouterV1)

//Error handler
app.use(errorHandler);

export default app