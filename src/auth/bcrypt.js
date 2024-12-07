import bcrypt from 'bcryptjs'

const hashPassword = async (password) => {
    const result = await bcrypt.hash(password, 10)
    return result
}

const isPasswordCorrect = async(orignnalPass, password) => {    
    return await bcrypt.compare(password, orignnalPass)
}

export {hashPassword, isPasswordCorrect}