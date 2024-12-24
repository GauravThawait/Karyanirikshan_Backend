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

const statsPercentageByDep = asyncHandler( async(req, res) => {

    const type1 = 'completed'
    const type2 = 'pending'

    let data = {
        completed_data : [],
        pending_data : []
    }

    data.completed_data = await workstatusService.getPercentStatus(type1)
    data.pending_data = await workstatusService.getPercentStatus(type2)


    if(!data){
        return res.status(200).json(new ApiResponse(200, [], "No data Found"))
    }

    return res.status(200).json(new ApiResponse(200, data, "Data found successfull"))
})

const docCountStats = asyncHandler( async(req, res) => {

    const monthNames = [
        'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 
        'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
    ];
    
    const response = await documentService.getDocumentCount()

    const data = response.map(item => {
        return {
            ...item,
            name: monthNames[item.month - 1]
        };
    });
    
    if(!data){
        return res.status(200).json(new ApiResponse(200, [], "No data Found"))
    }

    return res.status(200).json(new ApiResponse(200, data, "Data found successfull"))
})

export {statsByDepartment, allDocumentStats, statsPercentageByDep, docCountStats}