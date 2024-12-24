import express from 'express'
import errorHandler from './middleware/errorHandler.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'

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

//
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}))


//import routes
import userRouterV1 from './routes/v1/user.routes.js'
import departmentRouterV1 from './routes/v1/department.routes.js'
import registerRouterV1 from './routes/v1/register.routes.js'
import documentRouterV1 from './routes/v1/document.routes.js'
import transferRouterV1 from './routes/v1/transfer.routes.js'
import logsRouterV1 from './routes/v1/logs.routes.js'
import workStatusRouterV1 from './routes/v1/workstatus.routes.js'
import categoryRouterV1 from './routes/v1/category.routes.js'
import analyticsRouterV1 from './routes/v1/analytics.routes.js'


app.use("/api/v1/user", userRouterV1)
app.use("/api/v1/department", departmentRouterV1)
app.use("/api/v1/register", registerRouterV1)
app.use('/api/v1/document', documentRouterV1)
app.use('/api/v1/transfer',transferRouterV1)
app.use("/api/v1/log", logsRouterV1)
app.use("/api/v1/workstatus", workStatusRouterV1)
app.use("/api/v1/category", categoryRouterV1)
app.use("/api/v1/analytics", analyticsRouterV1)

//Error handler
app.use(errorHandler);

export default app