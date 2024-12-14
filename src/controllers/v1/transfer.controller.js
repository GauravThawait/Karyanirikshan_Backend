import departmentService from "../../services/v1/departmentService.js";
import documentLogService from "../../services/v1/documentLogService.js";
import documentService from "../../services/v1/documentService.js";
import transferService from "../../services/v1/transferService.js";
import userService from "../../services/v1/userService.js";
import workstatusService from "../../services/v1/workstatusService.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const createTransferReq = asyncHandler( async(req, res) => {
    const {documentId, fromDepartmentId, toDepartmentId, forwardedBy, remarks} = req.body


    if([documentId, fromDepartmentId, toDepartmentId, forwardedBy]
            .some((item) => item === undefined || item === null || item.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    if( fromDepartmentId == toDepartmentId){
        throw new ApiError(400, "Bad credentials")
    }
    
    const checkDocument = await documentService.getById(documentId)
    const validFormDepartment = await departmentService.getById(fromDepartmentId)
    const validToDepartment = await departmentService.getById(toDepartmentId)
    const isUser = await userService.getUserById(forwardedBy)

    if(!checkDocument || !validFormDepartment || !validToDepartment || !isUser)
    {
        throw new ApiError(400, "Bad request")
    }

    const data = await transferService.create(
        documentId, 
        fromDepartmentId, 
        toDepartmentId, 
        forwardedBy, 
        remarks
    )

    if(!data){
        throw new ApiError(500, "Internal Server Error")
    }

    return res.status(200).json(new ApiResponse(200, data, "Document Forwarded Successfully"))
    
})

const getListByDepartmentId = asyncHandler( async(req, res) => {
    const {Id} = req.params;

    if(Id === undefined || Id == null || Id.trim() ==""){
        throw new ApiError(400, "Bad request")
    }

    const findTransferLog = await departmentService.getById(Id)

    if(!findTransferLog){
        throw new ApiError(400, "Invalid Request Credentials")
    }

    const data = await transferService.getListByDepId(Id)

    if(!data){
        throw new ApiError(500, "Internal Server Error")
    }

    if(data.length === 0){
        return res.status(200).json(new ApiResponse(200, [], "No data found"))
    }

    return res.status(200).json(new ApiResponse(200, data, "Data found successfull"))

})


const acceptByTransferId = asyncHandler( async(req, res) => {
    const {Id, userId, type} = req.body; 
    // here id transfer_logs id

    if([Id, userId].some((item) => item == undefined || item == null || item.trim() == " ")){
        throw new ApiError(400, "All fields required")
    }

    if(type !== "accepted" && type !== "declined"){
        throw new ApiError(400, "Invalid request input")
    }

    const validTransferReq = await transferService.getById(Id)
    
    if(!validTransferReq){
        throw new ApiError(400, "No Transfer Log found")
    }

    const validUser = await userService.getUserById(userId)

    if(!validUser){
        throw new ApiError(400, "Invalid User Details")
    }

    if(validTransferReq.to_department_id !== validUser.department_id){
        throw new ApiError(403, "Invalid access to content")
    }

    const data = await transferService.updateTransferLog(Id, userId, type)

    const createWorkForDepartment = await workstatusService.create(
        data.document_id,           //document id
        data.to_department_id,      //department Id where work is recived and opened
        data.recived_by,            //who created the work for its department
    )

    const updateDocument = await documentService.updateCurrentDepartment(validTransferReq.to_department_id, validTransferReq.document_id)

    const updateDocumentLogs = await documentLogService.create(
        validTransferReq.document_id,
        validUser.department_id,
        validUser.id,
        `दस्तावेज प्राप्त`
    )
    
    if(!data || !createWorkForDepartment || !updateDocument || !updateDocumentLogs ){
        throw new ApiError(500, "Internal Server Error")
    }

    return res.status(200).json(new ApiResponse(200, data, "Document accepted successfully"))
})


export {createTransferReq, getListByDepartmentId, acceptByTransferId}