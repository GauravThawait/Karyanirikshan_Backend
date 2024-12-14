import departmentService from "../../services/v1/departmentService.js";
import documentLogService from "../../services/v1/documentLogService.js";
import documentService from "../../services/v1/documentService.js";
import userService from "../../services/v1/userService.js";
import workstatusService from "../../services/v1/workstatusService.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const updateStatus = asyncHandler( async(req, res) => {
    const {documentId, userId, remark} = req.body;

    if([documentId, userId].some((item) => item === undefined || item === null || item.trim() === " ")){
        throw new ApiError(400, "Invalid user input")
    }

    const validDocument = await documentService.getById(documentId)
    const validUser = await userService.getUserById(userId)
    const department = await departmentService.getById(validUser.department_id)

    if(!validDocument || !validUser){
        throw new ApiError(400, "Bad Request")
    }

    // if(validDocument.current_department !== validUser.department_id){
    //     throw new ApiError(403, "Invalid access to content")
    // }


    const data = await workstatusService.update(validDocument.id, validUser.id)

    const updateLogs = await documentLogService.create(
        validDocument.id,
        validUser.department_id,
        validUser.id,
        `दस्तावेज कार्य ${department.hindi_name} विभाग द्वारा पूर्ण`,
        remark
    )

    if(!data || !updateLogs){
        throw new ApiError(500, "Internal Server Error")
    }

    return res.status(200).json(new ApiResponse(200, data, "Document work completed by your department "))
}) 


export {updateStatus}