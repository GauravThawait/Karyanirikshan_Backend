import departmentService from "../../services/v1/departmentService.js";
import documentLogService from "../../services/v1/documentLogService.js";
import documentService from "../../services/v1/documentService.js";
import userService from "../../services/v1/userService.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const createLog = asyncHandler( async(req, res) => {

    const {documentId, handledDepartmentId, handledUserId, action, remark} = req.body

    if([documentId, handledDepartmentId, handledUserId, action]
            .some((item) => {
                item == undefined || item === null || item.trim() === ""
            })
    ){
        throw new ApiError(400, "All fields are required")
    }

    const validDocument = await documentService.getById(documentId)
    const validDepartment = await departmentService.getById(handledDepartmentId)
    const validUser = await userService.getUserById(handledUserId)

    if( !validDocument || !validDepartment || !validUser){
        throw new ApiError(400, "Invalid user inputs")
    }

    if(validDocument.current_department != handledDepartmentId){
        throw new ApiError(403, "Invalid access to content")
    }

    const data = await documentLogService.create(documentId, handledDepartmentId, handledUserId, action, remark)
    
    if(!data){
        throw new ApiError(500, "Internal Server Error")
    }

    return res.status(201).json(new ApiResponse(201, data, "Log Created Successfully"))
})


const getLogByDocumentId = asyncHandler( async(req, res) => {
    const {Id} = req.params;

    if(Id === undefined || Id === null || Id.trim() === " "){
        throw new ApiError(400, "All fields required")
    }

    const validDocument = await documentService.getById(Id)
    
    if(!validDocument){
        throw new ApiError(400, "Invalid User Input")
    }

    const data = await documentLogService.getByDocId(Id)

    if(!data){
        return res.status(200).json(new ApiResponse(200, [], "No data found"))
    }

    return res.status(200).json(new ApiResponse(200, data, "Logs Found Successfully"))
})

export {createLog, getLogByDocumentId}