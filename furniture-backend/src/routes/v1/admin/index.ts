import express from "express";
import { check } from "../../../middlewares/check";
import { getAllUser } from "../../../controllers/admin/userController";
import { setMaintenance } from "../../../controllers/admin/systemController";

const router = express.Router();

router.get("/users", check, getAllUser);
router.post("/maintenance", setMaintenance);
export default router;
