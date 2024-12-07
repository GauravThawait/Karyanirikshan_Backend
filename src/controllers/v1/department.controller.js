import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import departmentService from '../../services/v1/departmentService.js'
import { ApiResponse } from "../../utils/ApiResponse.js";

const createDepartment = asyncHandler( async(req, res) => {
    
    const {name, hindi_name} = req.body
    
    if([name, hindi_name].some((item) => item === undefined || item === null || item.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    const existDept = await departmentService.getByName(name);
    if(existDept){
        throw new ApiError(401, "Department already exist")
    }

    const response = await departmentService.create(name, hindi_name)

    if(!response){
        throw new ApiError(400, "Error while inserting department")
    }

    return res.status(200).json(new ApiResponse(200, response, "Department Created Sucessfully"))

})

export {createDepartment}