import dbClient from "../../db/connectDb.js"

const create = async(document_id, department_id, accepted_by_id) => {
    const query = `
        INSERT INTO work_status
            (
                document_id,
                department_id,
                accepted_by_id
            )
        VALUES
            ($1, $2, $3)
        RETURNING * `
    
    const result = await dbClient.query(query, [document_id, department_id, accepted_by_id])
    return result.rows[0]
}

const update = async(document_id, completed_by_id) => {
    const query = `
        UPDATE work_status
            SET
                completed_by_id = $1,
                completed_time = CURRENT_TIMESTAMP,
                status = 'completed'
            WHERE
                document_id = $2
            RETURNING * `

    const result = await dbClient.query(query, [completed_by_id, document_id])
    return result.rows
}

const workstatusService = {create, update}


export default workstatusService