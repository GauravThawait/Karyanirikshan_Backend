import Router from 'express'
import { createLog } from '../../controllers/v1/logs.controller.js'

const router = Router()

router.route("/update").post(createLog)

export default router