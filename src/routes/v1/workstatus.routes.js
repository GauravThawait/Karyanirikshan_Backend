import Router from 'express'
import { updateStatus } from '../../controllers/v1/workstatus.controller.js'

const router = Router()

router.route("/submit").post(updateStatus)

export default router