import dbClient from "../../db/connectDb.js"

const create = async(documentId, handledDepartmentId, handledUserId, action, remark) => {
    const query = `
        INSERT INTO document_logs
            (
                document_id,
                handled_department_id,
                handled_user_id,
                action,
                remark
            )
        VALUES ($1, $2, $3, $4, $5) RETURNING * `
    
        const result = await dbClient.query(query, [documentId, handledDepartmentId, handledUserId, action, remark])
        return result.rows[0]
}

const getLogsByDocId = async(Id) => {
    const query = `
        SELECT 
            dl.id,
            dl.document_id,
            doc.document_number,
            dep.hindi_name AS department_hindi_name,
            u.name AS handled_user,
            dl.action,
            dl.timestamp,
            dl.remark 
        FROM 
            document_logs dl
        JOIN 
            departments dep ON dl.handled_department_id = dep.id
        JOIN
            users u ON dl.handled_user_id = u.id
        JOIN
            documents doc ON dl.document_id = doc.id
        WHERE 
            dl.document_id = $1
        ORDER BY
            dl.timestamp DESC
        `

    const result = await dbClient.query(query, [Id])
    return result.rows || {rows :[]}
}

const documentLogService = {create, getLogsByDocId}
export default documentLogService