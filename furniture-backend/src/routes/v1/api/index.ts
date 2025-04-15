import express from "express";
import {
    changeLanguage,
    testPermission,
} from "../../../controllers/api/profileController";
import { authCheck } from "../../../middlewares/auth";

const router = express.Router();

router.post("/change-language", changeLanguage);
router.get("/test-permission", authCheck, testPermission);

export default router;
