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

const documentLogService = {create}
export default documentLogService