import express from "express"
import Router from "express"
import { acceptByTransferId, createTransferReq, getListByDepartmentId, pendingCountByDep} from "../../controllers/v1/transfer.controller.js"

const router = Router()

router.route("/create").post(createTransferReq)
router.route("/getlist/:Id").get(getListByDepartmentId)
router.route("/submit").post(acceptByTransferId)
router.route("/getcount/:Id").get(pendingCountByDep)

export default router

