import app from './app.js'
import dotenv from 'dotenv'
import dbClient from './db/connectDb.js'


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