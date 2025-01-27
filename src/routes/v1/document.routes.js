import { Router } from "express";

import { 
    createDocument, 
    deleteDocumentById, 
    disposeDocument, 
    documentFilter, 
    exportAllDocument, 
    getAllGradeDocument, 
    getAllList, 
    getDocByNumber, 
    getDocumentById, 
    getGroupDocumentByDate, 
    updateDocDetails, 
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
router.route("/insert/update").post(updateDocDetails)
router.route("/filter").post(documentFilter)
router.route('/getdoc/date').post(getGroupDocumentByDate) 

export default router