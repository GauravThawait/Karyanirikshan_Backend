import app from './src/app.js'
import dotenv from 'dotenv'
import dbClient from './src/db/connectDb.js'
import serverless from 'serverless-http';

dotenv.config()

dbClient.connect()
    .then(() => {
        console.log("Connected to PostgreSQL")
    })
    .catch(err => {
        console.error('Connection error', err.stack)
    })

app.get("/", (req, res) => {
    res.send("Server is running")
})

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server listening on PORT ${process.env.PORT}`)
})
// Export the handler for AWS Lambda-
export const handler = serverless(app);