import Router from 'express'
import { createDepartment, getByType } from '../../controllers/v1/department.controller.js'

const router = Router()

router.route("/create").post(createDepartment)
router.route("/getlist/:type").get(getByType)

export default router