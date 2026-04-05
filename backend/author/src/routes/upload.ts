import express from "express";
import { upload } from "../middleware/uploads.js";
import { isAuth } from "../middleware/isAuth.js";
import { uploadFile } from "../controllers/upload.js";

const uploadRouter = express.Router();

uploadRouter.post("/upload", isAuth, upload.single("file"), uploadFile);

export default uploadRouter;
