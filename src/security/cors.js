//this is for dev purpose remove in future
const allowedOrigins = [
    process.env.CLIENT_URL_DEV, 
    process.env.CLIENT_URL_STAGE, 
    process.env.CLIENT_URL_PROD
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