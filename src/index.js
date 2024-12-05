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


///just for testing purpose

app.post("/user/create", async(req, res) => {

    try {
        console.log("user created api hitted")
    const {name, email} = req.body

    const data = await dbClient.query('INSERT INTO users (name, email) VALUES ( $1, $2) RETURNING *', [name, email])

    if(data.rows.length === 0){
        res.status(400).json({messgae : "something wrong happens"})
    }

    res.status(200).json({message: "user create successfully", data : data.rows[0]})
    } catch (error) {
        console.log(error)
    }
})

app.get("/user/all", async(req, res) => {
    try {
        console.log("get all api hitted")
        const data = await dbClient.query('SELECT * FROM users')

        if(data.rows.length === 0){
            res.status(400).json({message : "No data found"})
        }
    
        res.status(200).json({messgae : "Data found successfully", data : data.rows})
    } catch (error) {
        console.log(error)
    }
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server listening on PORT ${process.env.PORT}`)
})