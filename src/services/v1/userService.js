import dbClient from "../../db/connectDb.js"
import {asyncHandler} from '../../utils/asyncHandler.js'

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

const getUserWithDepartment = async(userId) => {
    const query = ` SELECT 
            users.id AS id,
            users.name,
            users.username,
            users.role,
            departments.id AS department_id,
            departments.name AS department_name,
            departments.hindi_name AS department_hindi_name
        FROM
            users
        JOIN 
            departments ON users.department_id = department_id
        WHERE
            users.id = $1
        `;

    const result = await dbClient.query(query,[userId])
    return result.rows[0]
}


const userService = {getUserById, getByUsername, create, getUserWithDepartment}

export default userService