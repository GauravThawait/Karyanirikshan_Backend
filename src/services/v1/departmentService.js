import dbClient from "../../db/connectDb.js";

//Query to find department by ID
const getById = async(Id) => {
    const query = `SELECT * FROM departments WHERE id = $1`
    const values = [Id]
    const result = await dbClient.query(query, values)
    return result.rows[0]
}

const getByName = async(name) => {
    const query = 'SELECT * FROM departments WHERE name = $1'
    const result = await dbClient.query(query, [name])
    return result.rows[0]
}

const create = async(name, hindi_name, type) => {
    const query = 'INSERT INTO departments (name, hindi_name, type) VALUES ($1, $2, $3) RETURNING * '
    const result = await dbClient.query(query, [name, hindi_name, type])
    return result.rows[0]
}


const getListByType = async(type) => {
    const query = `SELECT * from departments WHERE type = $1`
    const result = await dbClient.query(query, [type])
    return result.rows || {rows : []}
}
const departmentService = {getById, getByName, create, getListByType}
export default departmentService