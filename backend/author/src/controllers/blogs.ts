import { Blogs } from "../models/blogs.js";
import { tryCatch } from "../utils/tryCatch.js";
import { validateRequiredFields } from "../utils/validatorsFun.js";
import { cacheInvalidate } from "./rabbitmq.js";

export const createBlog = tryCatch(async (req, res) => {
  const {
    title,
    description,
    content,
    author,
    authorId,
    authorName,
    category,
    tags,
    image,
  } =
    req.body;

  const result = validateRequiredFields(req.body, [
    "title",
    "description",
    "content",
    "author",
    "category",
    "tags",
    "image",
  ]);

  if (!result.isValid) {
    return res.status(400).json({
      message: "Missing required fields",
      missingFields: result.missing,
    });
  }

  const blog = await Blogs.create({
    title,
    description,
    content,
    author: authorName || author,
    authorId: authorId || author,
    authorName: authorName || author,
    category,
    tags,
    image,
  });

  await cacheInvalidate(["blogs:*"]);

  return res.status(201).json({ message: "Blog created successfully", blog });
});

export const updateBlog = tryCatch(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    content,
    author,
    authorId,
    authorName,
    category,
    tags,
    image,
  } =
    req.body;

  const existingBlog = await Blogs.findById(id);

  if (!existingBlog) {
    return res.status(404).json({
      message: "Blog not found",
    });
  }

  const blog = await Blogs.findByIdAndUpdate(
    id,
    {
      $set: {
        title,
        description,
        content,
        author: authorName || author,
        authorId: authorId || author,
        authorName: authorName || author,
        category,
        tags,
        image,
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  await cacheInvalidate(["blogs:*", `blogs: ${id} `]);

  return res.status(201).json({ message: "Blog created successfully", blog });
});

export const deleteBlog = tryCatch(async (req, res) => {
  const { id } = req.params;

  const existingBlog = await Blogs.findById(id);

  if (!existingBlog) {
    return res.status(404).json({
      message: "Blog not found",
    });
  }

  const blog = await Blogs.findByIdAndDelete(id);

  await cacheInvalidate(["blogs:*", `blogs: ${id} `]);

  return res.status(201).json({ message: "Blog deleted successfully", blog });
});
