import { Router } from "express";
import { createDocument, deleteDocumentById, disposeDocument, getAllList, getDocByNumber, getDocumentById } from "../../controllers/v1/document.controller.js";

const router = Router()

router.route("/create").post(createDocument)
router.route("/getlist").post(getAllList)
router.route("/get/:Id").get(getDocumentById)
router.route("/delete/:Id").get(deleteDocumentById)
router.route("/dispose").post(disposeDocument)
router.route("/search/:Id").get(getDocByNumber)

export default router