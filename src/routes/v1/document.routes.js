import { Router } from "express";
import { createDocument, deleteDocumentById, getAllList, getDocumentById } from "../../controllers/v1/document.controller.js";

const router = Router()

router.route("/create").post(createDocument)
router.route("/getlist").get(getAllList)
router.route("/get/:Id").get(getDocumentById)
router.route("/delete/:Id").get(deleteDocumentById)

export default router