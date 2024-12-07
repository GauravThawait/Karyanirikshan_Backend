import jwt from 'jsonwebtoken'

const generateToken = (Id) => {
    
    return jwt.sign(
        {
            _id : Id
        },
        process.env.TOKEN_SECRET_KEY,
        {
            expiresIn : process.env.TOKEN_EXPIRY
        }
    )

}

export {generateToken}