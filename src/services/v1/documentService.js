import dbClient from "../../db/connectDb.js"

const create = async(
        registerId, 
        dispatchDocNumber, 
        departmentId,
        title,
        description, 
        createdBy, 
        status, 
        priority, 
        grade, 
        tags, 
        currentDeprtmentId,
) => {

    const query = `
        INSERT INTO documents 
         (
            register_id, 
            dispatch_doc_number,
            department_id,       
            title,
            description, 
            created_by, 
            status, 
            priority, 
            grade, 
            tags, 
            current_department
         )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `

        const result = await dbClient.query(query, [
            registerId, 
            dispatchDocNumber, 
            departmentId,
            title,
            description, 
            createdBy, 
            status, 
            priority, 
            grade, 
            tags, 
            currentDeprtmentId
        ])

        return result.rows[0]
         
}

const getAllList = async() => {
    const query = `
        SELECT 
            d.id,
            d.document_number,
            d.created_at,
            d.title,
            d.status,
            dep.name AS department_name,
            dep.hindi_name AS department_hindi_name
        FROM
            documents d
        JOIN 
            departments dep ON d.department_id = dep.id
        `

    const result = await dbClient.query(query)
    return result || {rows : []}
}


const getById = async(Id) => {
    const query = `
    SELECT
        doc.id,
        doc.document_number,
        doc.dispatch_doc_number,
        doc.title,
        doc.description,
        doc.status,
        doc.priority,
        doc.grade,
        doc.tags,
        dep_current.hindi_name AS current_department_hindi_name,
        reg.hindi_name AS register_hindi_name,
        dep.name AS department_name,
        dep.hindi_name AS department_hindi_name,
        u.name AS created_by
    FROM 
        documents doc
    JOIN
        registers reg ON doc.register_id = reg.id
    JOIN
        departments dep ON doc.department_id = dep.id
    JOIN
        departments dep_current ON doc.current_department = dep_current.id
    JOIN
        users u ON doc.created_by = u.id
    WHERE
        doc.id = $1
    `

    const result = await dbClient.query(query,[Id])
    return result.rows[0]
}

const deleteById = async(Id) => {
    const query = `DELETE FROM documents WHERE id = $1`
    const result = await dbClient.query(query,[Id])

    return result.rowCount
}

const updateCurrentDepartment = async(documentId, currentDepartmentId) => {
    const query = `
        UPDATE documents
            SET
                current_department = $1
        WHERE
            id = $2
        RETURNING * `

    const result = await dbClient.query(query, [documentId, currentDepartmentId])
    return result.rows[0]
}

const updateStatus = async(documentId) => {
    const query = ` 
        UPDATE documents
            SET
                status = 'completed'
        WHERE 
            id = $1
        RETURNING * `
    
    const result = await dbClient.query(query, [documentId])

    return result.rows[0]
}



const documentService = {create, getAllList, getById, deleteById, updateCurrentDepartment, updateStatus}
export default documentService