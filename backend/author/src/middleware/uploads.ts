import multer from "multer";
import path from "path";
import fs from "fs";

const imageDir = "src/uploads/images";
const videoDir = "src/uploads/videos";

fs.mkdirSync(imageDir, { recursive: true });
fs.mkdirSync(videoDir, { recursive: true });

const allowedMimeTypes = ["image/", "video/"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      if (file.mimetype.startsWith("image/")) {
        return cb(null, imageDir);
      }

      if (file.mimetype.startsWith("video/")) {
        return cb(null, videoDir);
      }

      return cb(new Error("Only image and video files are allowed"), "");
    } catch (error) {
      return cb(error as Error, "");
    }
  },

  filename: (req, file, cb) => {
    try {
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);

      const ext = path.extname(file.originalname);

      cb(null, uniqueName + ext);
    } catch (error) {
      cb(error as Error, "");
    }
  },
});

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    return cb(null, true);
  }

  return cb(new Error("Only image and video files are allowed"));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});
