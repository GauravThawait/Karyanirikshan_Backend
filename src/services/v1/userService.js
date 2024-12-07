import dbClient from "../../db/connectDb.js"

//query to fetch a user by ID
const getUserById = async(userID) => {
    const query = 'SELECT * FROM users WHERE id = $1'
    const values = [userID]
    const result = await dbClient.query(query, values)
    return result.rows[0]
}


const getByUsername = async(username) => {
    const query = 'SELECT * FROM users WHERE username = $1'
    const result = await dbClient.query(query, [username])
    return result.rows[0]
}

const create = async(name, username, password, role, departmentId) => {
    const query = "INSERT INTO users (name, username, password, role, department_id) VALUES ($1, $2, $3, $4, $5) RETURNING * "
    const result = await dbClient.query(query, [name, username, password, role, departmentId])
    return result.rows[0]
}

const userService = {getUserById, getByUsername, create}

export default userService