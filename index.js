//import app from './app.js'
import dotenv from 'dotenv'
import dbClient from './src/db/connectDb.js'
import serverless from 'serverless-http';

import express from 'express'
import errorHandler from './src/middleware/errorHandler.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

//import routes
import userRouterV1 from './src/routes/v1/user.routes.js'
import departmentRouterV1 from './src/routes/v1/department.routes.js'
import registerRouterV1 from './src/routes/v1/register.routes.js'
import documentRouterV1 from './src/routes/v1/document.routes.js'
import transferRouterV1 from './src/routes/v1/transfer.routes.js'
import logsRouterV1 from './src/routes/v1/logs.routes.js'
import workStatusRouterV1 from './src/routes/v1/workstatus.routes.js'
import categoryRouterV1 from './src/routes/v1/category.routes.js'

dotenv.config()

dbClient.connect()
    .then(() => {
        console.log("Connected to PostgreSQL")
    })
    .catch(err => {
        console.error('Connection error', err.stack)
    })
    
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
 
    
app.use("/api/v1/user", userRouterV1)
app.use("/api/v1/department", departmentRouterV1)
app.use("/api/v1/register", registerRouterV1)
app.use('/api/v1/document', documentRouterV1)
app.use('/api/v1/transfer',transferRouterV1)
app.use("/api/v1/log", logsRouterV1)
app.use("/api/v1/workstatus", workStatusRouterV1)
app.use("/api/v1/category", categoryRouterV1)
    
    //Error handler
app.use(errorHandler);
    
app.get("/", (req, res) => {
    res.send("Server is running")
})

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server listening on PORT ${process.env.PORT}`)
})

// Export the handler for AWS Lambda-test
export const handler = serverless(app);