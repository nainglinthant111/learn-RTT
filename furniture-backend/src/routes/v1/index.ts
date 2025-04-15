import express from "express";

import { authCheck } from "../../middlewares/auth";
import healthRoute from "../../routes/v1/health";
import authRoute from "../../routes/v1/auth";
import adminRoute from "./admin";
import userRoute from "./api";
import { authorise } from "../../middlewares/authorise";
import { maintenance } from "../../middlewares/maintenance";

const router = express.Router();
// router.use("/api/v1", healthRoute);
router.use("/api/v1", maintenance, authRoute);
router.use("/api/v1/user", maintenance, userRoute);
router.use("/api/v1/admins", authCheck, authorise(true, "ADMIN"), adminRoute);

export default router;
