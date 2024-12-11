import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import documentService from "../../services/v1/documentService.js";

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
        currentDeprtmentId
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

    if(!data){
        throw new ApiError(500, "Internal Server Error")
    }

    return res.status(201).json( new ApiResponse(201, data, "Document Registered Successfully"))
})


const getAllList = asyncHandler( async(req, res)=> {
    const data = await documentService.getAllList()
    if(!data){
        return res.status(200).json(new ApiResponse(200, [], "No data found"))
    }

    return res.status(200).json(new ApiResponse(200, data.rows, "Data found Successfull"))
})


const getDocumentById = asyncHandler( async(req, res) => {

    const{Id} = req.params;

    if(Id === undefined || Id === null || Id.trim() === ""){
        throw new ApiError(400, "Invalid user input")
    }

    const data = await documentService.getById(Id)

    if(!data){
        return res.status(200).json(new ApiResponse(200, [], "No Data found"))
    }
    
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