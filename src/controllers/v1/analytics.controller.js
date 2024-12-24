import documentService from "../../services/v1/documentService.js";
import workstatusService from "../../services/v1/workstatusService.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const allDocumentStats = asyncHandler( async(req, res) => {
    const data = await documentService.getAllStats()

    if(!data){
        return res.status(200).json(new ApiResponse(200, [], "No data found"))
    }

    return res.status(200).json(new ApiResponse(200, data, "Data found successfull"))
})

const statsByDepartment = asyncHandler( async(req, res) => {
    const data = await workstatusService.statsByDepartment()
    
    if(!data){
        return res.status(200).json(new ApiResponse(200, [], "No data Found"))
    }

    return res.status(200).json(new ApiResponse(200, data, "Data found successfull"))
})

export {statsByDepartment, allDocumentStats}