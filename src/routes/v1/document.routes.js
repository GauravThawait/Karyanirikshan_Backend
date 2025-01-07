import { Router } from "express";
import { createDocument, deleteDocumentById, disposeDocument, exportAllDocument, getAllList, getDocByNumber, getDocumentById, updateDocument } from "../../controllers/v1/document.controller.js";

const router = Router()

router.route("/create").post(createDocument)
router.route("/getlist").post(getAllList)
router.route("/get/:Id").get(getDocumentById)
router.route("/delete/:Id").get(deleteDocumentById)
router.route("/dispose").post(disposeDocument)
router.route("/search/:Id").get(getDocByNumber)
router.route("/update").patch(updateDocument)
router.route("/export/all").get(exportAllDocument)

export default router