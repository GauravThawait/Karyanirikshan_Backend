import Router from 'express'
import { createLog, getLogByDocumentId } from '../../controllers/v1/logs.controller.js'

const router = Router()

router.route("/update").post(createLog)
router.route("/getlog/:Id").get(getLogByDocumentId)

export default router