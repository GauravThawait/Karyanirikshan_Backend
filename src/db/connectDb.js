import dotenv from 'dotenv'
import pg from "pg"

dotenv.config()

const {Client} = pg

const dbClient = new Client({
    host : process.env.HOST,
    port: process.env.DB_PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: {
        rejectUnauthorized: false  // Disable SSL certificate validation, adjust for your environment
    }
})

export default dbClient