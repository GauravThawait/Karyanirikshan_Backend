import Router from 'express'
import { getListByDeptId, registerCategory } from '../../controllers/v1/category.controller.js'

const router = Router()

router.route("/create").post(registerCategory)
router.route("/getlist/:Id").get(getListByDeptId)

export default router
