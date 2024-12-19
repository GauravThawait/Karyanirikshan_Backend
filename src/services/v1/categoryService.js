import dbClient from "../../db/connectDb.js"


const create = async(name, hindi_name, department_id) => {
    const query = `
        INSERT INTO category
            (
                name,
                hindi_name,
                department_id
            )
        VALUES ($1, $2, $3) RETURNING * `
    
    const result = await dbClient.query(query, [name, hindi_name, department_id])
    return result.rows[0]
}

const getListByDeptId = async(department_id) => {
    const query = `
        SELECT * FROM category
        WHERE department_id = $1 `
    const result = await dbClient.query(query, [department_id])
    return result.rows || { rows : []}
}

const getById = async(Id) => {
    const query = ` SELECT * FROM category WHERE id = $1 `
    const result = await dbClient.query(query, [Id])
    return result.rows[0]
}


const categoryService = {create , getListByDeptId, getById}

export default categoryService