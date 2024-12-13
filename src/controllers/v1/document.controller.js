import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import documentService from "../../services/v1/documentService.js";
import transferService from "../../services/v1/transferService.js";
import departmentService from "../../services/v1/departmentService.js";
import userService from "../../services/v1/userService.js";
import documentLogService from "../../services/v1/documentLogService.js";

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
        currentDeprtmentId //at the time of creation this id is users department id which registered document
    } = req.body

    const status = "created"

    if([registerId, 
        dispatchDocNumber, 
        title,
        departmentId,
        description, 
        createdBy,  
        currentDeprtmentId].some((item) => {
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
        currentDeprtmentId
    )

    // this function create a transfer req. of document when document is created
    const createTranfer = await transferService.create(
        data.id,                      //created document Id
        data.current_department,      // from department Id
        data.department_id,           // to deparment Id
        data.created_by               //created by user
    )

    const updateDocumentLog = await documentLogService.create(
        data.id,
        data.current_department,
        data.created_by,
        "दस्तावेज पंजीकृत"
    )

    if(!data || !createTranfer || !updateDocumentLog){
        throw new ApiError(500, "Internal Server Error")
    }

    return res.status(201).json( new ApiResponse(201, data, "Document Registered and Forwarded Successfully"))
})


const getAllList = asyncHandler( async(req, res)=> {
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
    const docLogs = await documentLogService.getLogsByDocId(Id)

    if(!data || !docLogs){
        return res.status(200).json(new ApiResponse(200, [], "No Data found"))
    }

    //attaching logs with data
    data.logs = docLogs;
    
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

export {createDocument, getAllList, getDocumentById, deleteDocumentById}