import { Router } from "express";
import { createDocument, deleteDocumentById, disposeDocument, getAllList, getDocumentById } from "../../controllers/v1/document.controller.js";

const router = Router()

router.route("/create").post(createDocument)
router.route("/getlist").get(getAllList)
router.route("/get/:Id").get(getDocumentById)
router.route("/delete/:Id").get(deleteDocumentById)
router.route("/dispose").post(disposeDocument)

export default router