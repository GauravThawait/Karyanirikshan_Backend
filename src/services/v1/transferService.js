import dbClient from "../../db/connectDb.js";


const create = async(documentId, fromDepartmentId, toDepartmentId, forwardedBy, remarks) => {
    const query = `
        INSERT INTO Transfer_Logs
            (
                document_id,
                from_department_id,
                to_department_id,
                forwarded_by,
                remarks
            )
        VALUES ($1, $2, $3, $4, $5) RETURNING *`

        const result = await dbClient.query(query, [documentId, fromDepartmentId, toDepartmentId, forwardedBy, remarks])

        return result.rows[0]
}


const getById = async(Id) => {
    const query = `SELECT * FROM Transfer_Logs WHERE id = $1`
    const result = await dbClient.query(query, [Id])
    return result.rows[0]
}

const getListByDepId = async(Id) => {
    const query = `
        SELECT
            t.id,
            doc.title AS document_title,
            dep.name AS from_department_name,
            dep.hindi_name AS from_department_hindi_name,
            t.forward_date,
            t.remarks
        FROM
            transfer_logs t
        JOIN
            documents doc ON t.document_id = doc.id
        JOIN
            departments dep ON t.from_department_id = dep.id
        WHERE 
            t.to_department_id = $1 AND t.is_acknowledged = false
        `

        const result = await dbClient.query(query, [Id])
        return result.rows || {rows : []}
}

const updateLogs = async(Id, recivedById) => {
    const query = `
        UPDATE Transfer_logs
        SET
            recived_by = $1,
            is_acknowledged = TRUE,
            acknowledged_date = CURRENT_TIMESTAMP
        WHERE id = $2 RETURNING *`

    const result = await dbClient.query(query, [recivedById, Id])
    return result.rows[0]
}


const transferService = {create, getById, getListByDepId, updateLogs}

export default transferService



 

