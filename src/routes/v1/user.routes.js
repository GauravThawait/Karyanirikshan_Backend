import Router from  'express'
import { login, logout, registerUser } from '../../controllers/v1/user.controller.js'

const router = Router()

router.route("/signup").post(registerUser)
router.route("/login").post(login)
router.route("/logout").post(logout)

export default router