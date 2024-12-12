import { ApiError } from "../utils/ApiError"
import jwt from 'jsonwebtoken'
const auth = (req, res, next) => {
    try {
        const token = req.cookies?.token

        if(!token){
            throw new ApiError(401, "Authentication token is missing")
        }

        const decode = jwt.verify(token, process.env.TOKEN_SECRET_KEY)

        req.user = decode
        console.log("user ID in auth middleware :", req.user)
        next()

    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            next(new ApiError(401, "Invalid authentication token"));
        } else if (error.name === "TokenExpiredError") {
            next(new ApiError(401, "Authentication token has expired"));
        } else {
            next(new ApiError(500, "Authentication server error"));
        }
    }
}

export default auth
