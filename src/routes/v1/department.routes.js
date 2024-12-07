import Router from 'express'
import { createDepartment } from '../../controllers/v1/department.controller.js'

const router = Router()

router.route("/create").post(createDepartment)

export default router