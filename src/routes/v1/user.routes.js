import Router from  'express'
import { login, registerUser } from '../../controllers/v1/user.controller.js'

const router = Router()

router.route("/signup").post(registerUser)
router.route("/login").post(login)

export default router