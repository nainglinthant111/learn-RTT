import express from "express";
import { check } from "../../../middlewares/check";
import { getAllUser } from "../../../controllers/admin/userController";

const router = express.Router();

router.get("/users", check, getAllUser);

export default router;
