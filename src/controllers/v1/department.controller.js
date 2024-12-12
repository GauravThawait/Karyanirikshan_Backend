import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import departmentService from '../../services/v1/departmentService.js'
import { ApiResponse } from "../../utils/ApiResponse.js";
import documentService from "../../services/v1/documentService.js";

const createDepartment = asyncHandler( async(req, res) => {
    
    const {name, hindi_name, type} = req.body
    
    if([name, hindi_name, type].some((item) => item === undefined || item === null || item.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    const existDept = await departmentService.getByName(name);
    if(existDept){
        throw new ApiError(401, "Department already exist")
    }

    const response = await departmentService.create(name, hindi_name, type)

    if(!response){
        throw new ApiError(400, "Error while inserting department")
    }

    return res.status(200).json(new ApiResponse(200, response, "Department Created Sucessfully"))

})

const getByType = asyncHandler( async(req, res) => {
    const {type} = req.params;

    if( type!== 'internal' && type !== 'external'){
        throw new ApiError(400, "Invalid input request")
    }

    const data = await departmentService.getListByType(type)

    if(!data){
        throw new ApiError(500, "Internal Server error or No data found")
    }

    return res.status(200).json(new ApiResponse(200, data, "Data found successfull" ))

})

export {createDepartment, getByType}