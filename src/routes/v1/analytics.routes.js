import Router from 'express'
import { allDocumentStats, dayWiseData, docCountStats, statsByDepartment, statsPercentageByDep } from '../../controllers/v1/analytics.controller.js'

const router = Router()

router.route("/getallstats").get(allDocumentStats)
router.route("/getdepartmentstats").get(statsByDepartment)
router.route("/getpercentage").get(statsPercentageByDep)
router.route("/getmonthcount").get(docCountStats)
router.route("/getmonthlygrowth").get(dayWiseData)

export default router