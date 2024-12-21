import categoryService from "../../services/v1/categoryService.js";
import departmentService from "../../services/v1/departmentService.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const registerCategory = asyncHandler( async(req, res)=> {

    const {name, hindiName, departmentId} = req.body;

    if([name, hindiName, departmentId]
        .some((item) => item === undefined || item === null || item.trim() === "")){
            throw new ApiError(400, "All fields required")
    }

    const validDepartment = await departmentService.getById(departmentId)

    if(!validDepartment){
        throw new ApiError(400, "Invalid department")
    }

    const data = await categoryService.create(name, hindiName, departmentId)

    if(!data){
        throw new ApiError(500, "Internal Server Error")
    }

    return res.status(201).json(new ApiResponse(201, data, "Category created successfully"))

})

const getListByDeptId = asyncHandler( async(req, res) => {

    const {Id} = req.params;      // deapartment Id
 
    if(!Id || Id === undefined || Id === null ){
        throw new ApiError(400, "Invalid Request")
    }

    const validDepartment = await departmentService.getById(Id)

    if(!validDepartment){
        throw new ApiError(400, "Bad request")
    }

    const data = await categoryService.getListByDeptId(Id)

    if(!data){
        return res.status(200).json(new ApiResponse(200, [], "No data found"))
    }

    return res.status(200).json(new ApiResponse(200, data, "Data found successfull"))
})


export {registerCategory, getListByDeptId}