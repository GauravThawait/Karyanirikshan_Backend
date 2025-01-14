import { Router } from "express";

import { 
    createDocument, 
    deleteDocumentById, 
    disposeDocument, 
    exportAllDocument, 
    getAllGradeDocument, 
    getAllList, 
    getDocByNumber, 
    getDocumentById, 
    updateDocGrade, 
    updateDocument 
} from "../../controllers/v1/document.controller.js";

const router = Router()

router.route("/create").post(createDocument)
router.route("/getlist").post(getAllList)
router.route("/get/:Id").get(getDocumentById)
router.route("/delete/:Id").get(deleteDocumentById)
router.route("/dispose").post(disposeDocument)
router.route("/search/:Id").get(getDocByNumber)
router.route("/update").patch(updateDocument)
router.route("/grade/update").post(updateDocGrade)
router.route("/grade/getall").get(getAllGradeDocument)
router.route("/export/all").post(exportAllDocument)

export default router