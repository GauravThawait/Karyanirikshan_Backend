import dotenv from 'dotenv'
dotenv.config()

const allowedOrigins = [
    process.env.CLIENT_URL_DEV,
    process.env.CLIENT_URL_LOCAL,
    process.env.CLIENT_URL_LOAD_BALANCER
    // process.env.CLIENT_URL_STAGE,
    // process.env.CLIENT_URL_PROD
]

const corsOptions = {
    origin : (origin, callback) => {
       
        if(process.env.NODE_ENV === 'development'){
            callback(null, true)
        }
        else {
            if(allowedOrigins.includes(origin)){
                callback(null, true)
            }else{
                callback(new Error('Not allowed by CORS'))
            }
        }
    },
    credentials : true,
    allowedHeaders: ['Content-Type', 'Authorization']
}

// const corsOptions = {
//     origin : process.env.CLIENT_URL || '*',
//     credentials : true,
//     allowedHeaders: ['Content-Type', 'Authorization']
// }

export default corsOptions