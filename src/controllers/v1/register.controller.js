import { asyncHandler } from "../../utils/asyncHandler.js";
import registerService from "../../services/v1/registerService.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const registerCreate = asyncHandler( async(req, res) => {
    const {name, hindi_name} = req.body

    if([name, hindi_name]
        .some((item) => item === undefined || item === null || item.trim() === '')
    ){
        throw new ApiError(400, "All fields are required")
    }

    const existRegister = await registerService.getByName(name)
   
    if(existRegister){
        throw new ApiError(409, "Already exist name")
    }
    const data = await registerService.create(name, hindi_name)

    if(!data){
        throw new ApiError(500, "Something went wrong")
    }

    return res.status(200).json( new ApiResponse(200, data, "Register created sucessfully"))
})


const allRegister = asyncHandler( async(req, res) => {
    const data = await  registerService.getAll()

    if(!data || data.rows.length == 0 ){
        return res.status(200).json(new ApiResponse(200, [], "No data found"))
    }

    return res.status(200).json(new ApiResponse(200, data.rows, "Data foound Successfully"))
})


export {registerCreate, allRegister}