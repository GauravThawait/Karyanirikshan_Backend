import { Router } from "express";
import { allRegister, registerCreate } from "../../controllers/v1/register.controller.js";

const router = Router()


router.route("/create").post(registerCreate)
router.route("/getall").get(allRegister)

export default router