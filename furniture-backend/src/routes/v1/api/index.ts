import express from "express";
import {
    changeLanguage,
    testPermission,
    uploadProfile,
    uploadProfileMultiple,
    uploadProfileOtp,
} from "../../../controllers/api/profileController";
import { authCheck } from "../../../middlewares/auth";
import upload, { uploadMemory } from "../../../middlewares/uploadFile";
import {
    getPost,
    getPostsByPagination,
    getInfinitePostsByPagination,
} from "../../../controllers/api/postController";

const router = express.Router();

router.post("/change-language", changeLanguage);
router.get("/test-permission", authCheck, testPermission);
router.patch(
    "/profile/upload",
    authCheck,
    upload.single("avatar"),
    uploadProfile
);
router.patch(
    "/profile/upload/optimize",
    authCheck,
    upload.single("avatar"),
    uploadProfileOtp
);
router.patch(
    "/profile/upload/multiple",
    authCheck,
    upload.array("avatar"),
    uploadProfileMultiple
);

router.get("/posts", authCheck, getPostsByPagination);
router.get("/posts/infinite", authCheck, getInfinitePostsByPagination);
router.get("/posts/:id", authCheck, getPost);
export default router;
