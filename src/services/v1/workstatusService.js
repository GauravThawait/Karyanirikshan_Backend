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


const statsByDepartment = async() => {
    const query = `
        SELECT 
             ws.department_id,
             dep.name AS department_name,
             dep.hindi_name AS department_hindi_name,
        COUNT(*) AS total_documents,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_documents,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_documents,
        COUNT(CASE WHEN DATE(timestamp) = CURRENT_DATE THEN 1 END) AS today_inserted_documents,
            CASE 
                WHEN COUNT(CASE WHEN status = 'completed' AND DATE(ws.timestamp) = CURRENT_DATE THEN 1 END) > 0 THEN true
                ELSE false
            END AS completed_progress
        FROM 
            work_status ws
        JOIN
            departments dep ON dep.id = ws.department_id
        GROUP BY 
            ws.department_id, dep.name, dep.hindi_name `
    
    const result = await dbClient.query(query)

    return result.rows || []
}


const workstatusService = {create, update, statsByDepartment, statsByDepartment}

export default workstatusService