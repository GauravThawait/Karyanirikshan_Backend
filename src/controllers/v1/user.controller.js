import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import userService from "../../services/v1/userService.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { hashPassword, isPasswordCorrect } from "../../auth/bcrypt.js";
import { generateToken } from "../../auth/jwtAuth.js";


const registerUser = asyncHandler( async(req,res) => {
    const {name, username, password, role, departmentId} = req.body;

    console.log(req.body)

    if([name, username, password, role, departmentId]
        .some((item) => item === undefined || item === null || item.trim() === '' ))
        {
            throw new ApiError(400, "All fileds required")
        }

    const existUser = await userService.getByUsername(username)

    if(existUser){
        throw new ApiError(409, "User already exists")
    }

    const newPassword = await hashPassword(password)

    const data = await userService.create(name, username, newPassword, role, departmentId)

    if(!data){
        throw new ApiError(500, "Error while creating user")
    }

    return res.status(200).json(new ApiResponse(200, data, "User Created Successfully"))
})

const login = asyncHandler( async(req, res)=> {
    const {username, password} = req.body

    if(!username || !password){
        throw new ApiError(409, "All fields required")
    }

    const existUser = await userService.getByUsername(username)

    if(!existUser){
        throw new ApiError(404, "No user found")
    }

    const isPasswordMatch = await isPasswordCorrect(existUser.password, password)
    
    if(!isPasswordMatch){
        throw new ApiError(404,"Invalid user credentials")
    }

    const token = generateToken(existUser.id)

    const options = {
        httpOnly : true,
        secure : true,
        sameSite : 'strict'
    }

    delete existUser.password

    return res.status(200)
    .cookie("token", token, options)
    .json(
        new ApiResponse(
            200,
            existUser
        )
    )

})

export {registerUser, login}