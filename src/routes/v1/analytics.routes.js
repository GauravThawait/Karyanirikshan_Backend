import Router from 'express'
import { allDocumentStats, statsByDepartment } from '../../controllers/v1/analytics.controller.js'

const router = Router()

router.route("/getallstats").get(allDocumentStats)
router.route("/getdepartmentstats").get(statsByDepartment)

export default router