import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import documentService from "../../services/v1/documentService.js";
import transferService from "../../services/v1/transferService.js";
import departmentService from "../../services/v1/departmentService.js";
import userService from "../../services/v1/userService.js";
import documentLogService from "../../services/v1/documentLogService.js";
import categoryService from "../../services/v1/categoryService.js";
import registerService from "../../services/v1/registerService.js";
import xlsx from 'xlsx';
import formatedDate from "../../utils/dateConvert.js";

const createDocument = asyncHandler( async(req, res) => {

    const {
        registerId, 
        dispatchDocNumber,
        departmentId,
        title,
        description, 
        createdBy, 
        priority, 
        grade, 
        tags, 
        currentDeprtmentId, //at the time of creation this id is users department id which registered document
        categoryId,
        date
    } = req.body

    const status = "created"

    if([registerId, 
        dispatchDocNumber, 
        title,
        departmentId,
        description, 
        createdBy,  
        currentDeprtmentId,
        date].some((item) => {
            item === undefined || item === null || item.trim() === ""
        })){
            throw new ApiError(400, "All fields are required")
        }

    const validDepartment = await departmentService.getById(departmentId)

    const validCurrentDepartment = await departmentService.getById(currentDeprtmentId)
    
    const validUser = await userService.getUserById(createdBy)

    if(!validDepartment || !validCurrentDepartment || !validUser){
        throw new ApiError(400, "Invalid Request")
    }

    const createdAt = formatedDate(date)
   
    //this logic for complaint section doc creation
    if(validDepartment.name === "Complaint"){
        if(!categoryId){
            throw new ApiError(400, "All fields required")
        }

        const validCategory = await categoryService.getById(categoryId)

        if(!validCategory){
            throw new ApiError(400, "Invalid Request")
        }
    }

    const data = await documentService.create(
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
    )
    
    // this function create a transfer req. of document when document is created
    const createTranfer = await transferService.create(
        data.id,                      //created document Id
        data.current_department,      // from department Id
        data.department_id,           // to deparment Id
        data.created_by               //created by user
    )

    const updateLog1 = await documentLogService.create(
        data.id,
        data.current_department,
        data.created_by,
        "दस्तावेज पंजीकृत "
    )

    const updateLog2 = await documentLogService.create(
        data.id,
        data.current_department,
        data.created_by,
        `दस्तावेज ${validDepartment.hindi_name} भेजा गया`
    )

    if(!data || !createTranfer || !updateLog1 || !updateLog2){
        throw new ApiError(500, "Internal Server Error")
    }

    return res.status(201).json( new ApiResponse(201, data, "Document Registered and Forwarded Successfully"))
})


const getAllList = asyncHandler( async(req, res)=> { // for getting all and deparmtnet wise list

    const {departmentId} = req.body;  //department Id

    if(departmentId){  // id passed than

        if(departmentId === undefined || departmentId === null || departmentId.trim() === ""){
            throw new ApiError(400, "Invalid Request")
        }

        const validDepartment = await departmentService.getById(departmentId)

        if(!validDepartment){
            throw new ApiError(400, "Bad request")
        }

        const data = await documentService.getDocByDeptId(departmentId)

        if(!data){
            return res.status(200).json(new ApiResponse(200, [], "No data found"))
        }

        return res.status(200).json(new ApiResponse(200, data, "Data found successfull"))
    }

    //if not passed than all data
    const data = await documentService.getAllList()
    if(!data){
        return res.status(200).json(new ApiResponse(200, [], "No data found"))
    }

    return res.status(200).json(new ApiResponse(200, data.rows, "Data found Successfull"))
})


const getDocumentById = asyncHandler( async(req, res) => {
    //here id is document_id
    const{Id} = req.params; 

    if(Id === undefined || Id === null || Id.trim() === ""){
        throw new ApiError(400, "Invalid user input")
    }

    const data = await documentService.getById(Id)
    // const docLogs = await documentLogService.getLogsByDocId(Id)

    if(!data){
        return res.status(200).json(new ApiResponse(200, [], "No Data found"))
    }

    // //attaching logs with data
    // data.logs = docLogs;
    
    return res.status(200).json(new ApiResponse(200, data, "Data found successfully"))
})

const deleteDocumentById = asyncHandler( async(req, res)=> {
    const {Id} = req.params

    if(Id === undefined || Id === null || Id.trim() === ""){
        throw new ApiError(404, "Invalid user input")
    }

    const data = await documentService.deleteById(Id)

    if(data == 0){
        throw new ApiError(500, "Something went wrong")
    }

    return res.status(200).json(new ApiResponse(200, [], "Document deleted successfully"))

})


const disposeDocument = asyncHandler(async(req, res) => {
    const {documentId, userId, remark} = req.body;   // here Id is document Id

    if([documentId, userId].some((item => item === undefined || item === null || item.trim() === " "))){
        throw new ApiError(400, "Invalid user inputs")
    }

    const validDocument = await documentService.getById(documentId);
    const validUser = await userService.getUserById(userId)

    if(!validDocument || !validUser){
        throw new ApiError(400, "Bad Request")
    }

    const data = await documentService.updateStatus(documentId, "completed")

    const updateLogs = await documentLogService.create(
        data.id,                        //document Id
        validUser.department_id,          // department Id of the users which perform action
        validUser.id,                    // usrer id which performed action
        "दस्तावेज कार्य सम्पूर्ण",
        remark
    )

    if(!data || !updateLogs){
        throw new ApiError(500, "Internal Server Error")
    }

    return res.status(200).json(new ApiResponse(200, data, "Document disposed successfully"))
    

})

const getDocByNumber = asyncHandler( async(req, res) => {
    const {Id} = req.params // this expect document number starts with KN

    if(Id === undefined || Id === null || Id.trim() === ""){
        throw new ApiError(400, "Invalid Request")
    }

    if(!Id.startsWith("KN")){
        throw new ApiError(400, "Bad request")
    }

    const data = await documentService.getBydocNum(Id)

    if(!data){
        return res.status(200).json(new ApiResponse(200, [], "No data found"))
    }

    return res.status(200).json(new ApiResponse(200, data, "Data found successfull"))
})


const updateDocument = asyncHandler( async(req, res) => {
        
       const {
        documentId,
        registerId,
        dispatchDocNumber, 
        departmentId,
        title,
        description,
        createdBy, 
        priority, 
        grade, 
        tags, 
        categoryId
        } = req.body

    if(documentId === undefined || documentId === null || documentId.trim() === " "){
        throw new ApiError(400, "Invalid document Id")
    }

    const validDocument = await documentService.getById(documentId)

    if(!validDocument){
         throw new ApiError(400, "Document not found")
    }

    const validUser = await userService.getUserById(createdBy)

    if(!validUser){
        throw new ApiError(400, "Invalid User")
    }

    if(validUser.department_id !== validDocument.current_department){
        throw new ApiError(403, "Invalid access to content")
    }

    if(registerId){
        const validRegister = await registerService.getById(registerId)
        if(!validRegister){
            throw new ApiError(400, "Invalid user input")
        }

    }

    if(departmentId){
        const validDepartment = await departmentService.getById(departmentId)
    
        if(!validDepartment){
            throw new ApiError(400, "Invalid user input")
        }
    }


    const updatedFields = {
        ...(registerId && { register_id: registerId }),
        ...(dispatchDocNumber && { dispatch_doc_number: dispatchDocNumber }),
        ...(departmentId && { department_id: departmentId }),
        ...(title && { title }),
        ...(description && { description }),
        ...(priority && { priority }),
        ...(grade && { grade }),
        ...(tags && { tags }),
        ...(categoryId && { category_id: categoryId }),
    };

    const data = await documentService.updateById(documentId, updatedFields)
    
    const updatelog = await documentLogService.create(
        documentId,
        validUser.department_id,
        validUser.id,
        "दस्तावेज विवरण संपादित किया गया"
    )

    if(!data || !updatelog){
         throw new ApiError(500, "Internal Server Error")
    }

    return res.status(200).json(new ApiResponse(200, [] ,"Data updated successfully"))
        
})

const exportAllDocument = asyncHandler( async(req, res) => {

    const {fromDate, toDate, department} = req.body

    if(department === undefined || department === null || department.trim() === " "){
        throw new ApiError(400, "Invalid user request")
    }

    let fromDateUTC;
    let toDateUTC;

    if(fromDate){
        fromDateUTC = new Date(fromDate)
        fromDateUTC.setUTCHours(0, 0, 0, 0);
        fromDateUTC.toISOString()
    }

    if(toDate){
        toDateUTC = new Date(toDate)
        toDateUTC.setUTCHours(23, 59, 59, 999);
        toDateUTC.toISOString()
    }
    console.log(fromDateUTC, toDateUTC)
    if (department.toLowerCase() === "all") {
        const data = await documentService.exportData(fromDateUTC, toDateUTC, department);

        if(!data){
            throw new ApiError(500, "Internal Server Error")
        }

        return handleExcelExport(data, res);
    }

    if (isValidUUID(department)) {
     
        const validDepartment = await departmentService.getById(department);
        if (!validDepartment) {
            throw new ApiError(400, "Invalid department ID");
        }

        const data = await documentService.exportData(fromDateUTC, toDateUTC, validDepartment.id);

        if(!data){
            throw new ApiError(500, "Internal Server Error")
        }
      
        return handleExcelExport(data, res);
    }
    
})

// function to sxport excel
const handleExcelExport = (data, res) => {
    if (!data || data.length === 0) {
        throw new ApiError(400, "No data found");
    }

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Documents");

    const excelBuffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=documents.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    res.status(200).send(excelBuffer);
};

const isValidUUID = (str) => {
    const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return regex.test(str);
};



const getAllGradeDocument = asyncHandler(async(req, res) => {
    
    const data = await documentService.getGradeDocument()

    if(!data){
        return res.status(200).json(new ApiResponse(200, [], "No data found"))
    }

    return res.status(200).json(new ApiResponse(200, data, "Data found Successfully"))
})


export {
    createDocument, 
    getAllList, 
    getDocumentById, 
    deleteDocumentById, 
    disposeDocument, 
    getDocByNumber, 
    updateDocument, 
    exportAllDocument,
    getAllGradeDocument
}
