import dbClient from "../../db/connectDb.js"
import {asyncHandler} from '../../utils/asyncHandler.js'

const create = async(name, hindi_name) => {
    const query = 'INSERT INTO registers (name, hindi_name) VALUES ($1, $2) RETURNING * '
    const result = await dbClient.query(query, [name, hindi_name])
    return result.rows[0]
}

const getAll = async() => {
    const query = 'SELECT * FROM registers'
    const result = await dbClient.query(query)
    return result || {rows: []}
}

const getByName = async(name) => {
    const query = 'SELECT * FROM registers WHERE name = $1'
    const result = await dbClient.query(query, [name])
    return result.rows[0]
}

const registerService = {create, getAll, getByName}

export default registerService