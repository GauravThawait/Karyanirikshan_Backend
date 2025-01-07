import dbClient from "../../db/connectDb.js"
import { ApiError } from "../../utils/ApiError.js"

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
        categoryId,
        createdAt
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
            current_department,
            category_id,
            created_at
         )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
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
            currentDeprtmentId,
            categoryId,
            createdAt
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
        ORDER BY
            d.created_at DESC `

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
        doc.current_department,
        doc.register_id,
        doc.category_id,
        doc.created_at,
        doc.timestamp,
        dep_current.hindi_name AS current_department_hindi_name,
        reg.hindi_name AS register_hindi_name,
        dep.name AS department_name,
        dep.type AS department_type,
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

const updateStatus = async(documentId, status) => {
    const query = ` 
        UPDATE documents
            SET
                status = $1
        WHERE 
            id = $2
        RETURNING * `
    
    const result = await dbClient.query(query, [status, documentId])

    return result.rows[0]
}


const getDocByDeptId = async(departmentId) => {
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
        JOIN
            work_status w ON w.document_id = d.id
        WHERE 
            w.department_id = $1
        ORDER BY
            d.created_at DESC `

    const result = await dbClient.query(query, [departmentId])
    return result.rows || {rows : []}
}

const getAllStats = async() => {
    const query = `
        SELECT 
            COUNT(*) AS total_documents,
            COUNT(CASE WHEN status = 'pending' OR status = 'created' THEN 1 END) AS pending_documents,
            COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_documents,
            COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END) AS today_inserted_documents
        FROM
            documents `
    
    const result = await dbClient.query(query)
    return result.rows || []

}

const getDocumentCount = async() => {
    const query = `
        SELECT 
            EXTRACT(MONTH FROM created_at) AS month,
            COUNT(*) AS value
        FROM 
            documents
        WHERE 
            EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)  -- Filter for the current year
        GROUP BY 
            EXTRACT(MONTH FROM created_at)
        ORDER BY 
            month `

    const result = await dbClient.query(query)

    return result.rows || []
}

const getDayWiseData = async (month, year) => {
    const query = `
        SELECT 
            DATE(created_at) AS day,
            COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_count,
            COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_count,
            COUNT(CASE WHEN status != 'completed' AND CURRENT_DATE - created_at > INTERVAL '10 days' THEN 1 END) AS delayed_count
        FROM 
            documents
        WHERE 
            EXTRACT(MONTH FROM created_at) = $1
            AND EXTRACT(YEAR FROM created_at) = $2
        GROUP BY 
            DATE(created_at)
        ORDER BY 
            day;
    `;

    const result = await dbClient.query(query, [month, year]);

    return result.rows || [];
};

const getBydocNum = async(Id) => {
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
        doc.current_department,
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
        doc.document_number = $1
    `
    const result = await dbClient.query(query,[Id])
    return result.rows[0]
}

const updateById = async(documentId, updatedFields) => {

    const fields = Object.keys(updatedFields)
    if(fields.length === 0){
        throw new ApiError("No fields to update")
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(", ")
  
    const query = ` 
        UPDATE documents
            SET ${setClause}
        WHERE id = $1
            RETURNING * `
    
    const values = [documentId, ...fields.map((field) => updatedFields[field])]

    const result = await dbClient.query(query, values);

    return result.rows[0]
}


//export data in xlsx query 

const exportAllData = async() => {
    const query = `
    SELECT
        doc.document_number AS "दस्तावेज क्रमांक",
        doc.dispatch_doc_number AS "आवक-जावक क्रमांक",
        reg.hindi_name AS "रजिस्टर",
        dep.hindi_name AS "शाखा",
        doc.title AS "शीर्षक",
        doc.description AS "विवरण",
        dep_current.hindi_name AS "वर्त्तमान शाखा",
        doc.status AS "स्थिति",
        doc.grade AS "ग्रेड",
        u.name AS "द्वारा पंजीकृत",
        doc.created_at AS "पंजीकृत दिनांक"
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
    `

    const result = await dbClient.query(query)

    return result.rows || []
}

const documentService = {
    create, 
    getAllList, 
    getById, 
    deleteById, 
    updateCurrentDepartment, 
    updateStatus, 
    getDocByDeptId, 
    getAllStats, 
    getDocumentCount, 
    getDayWiseData, 
    getBydocNum,
    updateById,
    exportAllData
}
export default documentService