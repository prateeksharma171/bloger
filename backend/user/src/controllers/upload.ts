import { tryCatch } from "../utils/tryCatch.js";

export const uploadFile = tryCatch(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded",
    });
  }

  const folder = req.file.mimetype.startsWith("image/") ? "images" : "videos";
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${folder}/${req.file.filename}`;

  res.status(200).json({
    message: "File uploaded successfully",
    file: req.file,
    url: fileUrl,
  });
});
