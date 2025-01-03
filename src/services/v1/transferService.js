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
            t.document_id AS document_id
            doc.document_number AS document_number,
            doc.title AS document_title,
            t.to_department_id AS to_department_id,
            to_dep.name AS to_department_name,
            to_dep.hindi_name AS to_department_hindi_name,
            t.from_department_id AS from_department_id,
            from_dep.name AS from_department_name,
            from_dep.hindi_name AS from_department_hindi_name,
            t.forward_date,
            t.remarks
        FROM
            transfer_logs t
        JOIN
            documents doc ON t.document_id = doc.id
        JOIN
            departments from_dep ON t.from_department_id = from_dep.id
        JOIN
            departments to_dep ON t.to_department_id = to_dep.id
        WHERE 
            t.to_department_id = $1 AND t.status = 'pending'
        ORDER BY
            forward_date DESC `
        const result = await dbClient.query(query, [Id])
        return result.rows || {rows : []}
}

const updateTransferLog = async(Id, recivedById, type) => {

    const query = `
        UPDATE Transfer_logs
        SET
            recived_by = $1,
            status = $2,
            acknowledged_date = CURRENT_TIMESTAMP
        WHERE id = $3 RETURNING *`

    const result = await dbClient.query(query, [recivedById, type, Id])
    return result.rows[0]
}

const getCountByDep = async(departmentId) => {
    const query = `
        SELECT COUNT(*) AS pending_request_count
        FROM transfer_logs
        WHERE to_department_id = $1 AND status = 'pending'`

    const result = await dbClient.query(query, [departmentId])
    return result.rows || 0
}

const transferService = {create, getById, getListByDepId, updateTransferLog, getCountByDep}

export default transferService



 

