import express from "express";
import { check } from "../../../middlewares/check";
import { getAllUser } from "../../../controllers/admin/userController";
import { setMaintenance } from "../../../controllers/admin/systemController";
import upload from "../../../middlewares/uploadFile";
import {
    createPost,
    deletePost,
    updatePost,
} from "../../../controllers/admin/postController";

const router = express.Router();

router.get("/users", check, getAllUser);
router.post("/maintenance", setMaintenance);

// CRUD post
router.post("/posts", upload.single("image"), createPost);
router.patch("/posts", upload.single("image"), updatePost);
router.delete("/posts", deletePost);
export default router;
