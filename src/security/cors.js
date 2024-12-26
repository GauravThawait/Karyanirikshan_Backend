import dotenv from 'dotenv'

dotenv.config()

const allowedOrigins = [
    process.env.CLIENT_URL_DEV, 
    process.env.CLIENT_URL_STAGE, 
    process.env.CLIENT_URL_PROD,
    process.env.CLIENT_URL_LOCAL
]

const corsOptions = {
    origin : (origin, callback) => {
        if(allowedOrigins.includes(origin)){
            callback(null, true)
        }
        else{
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials : true,
    allowedHeaders: ['Content-Type', 'Authorization']
}

export default corsOptions