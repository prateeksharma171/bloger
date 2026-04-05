import dotenv from "dotenv";
import { validateRequiredFields } from "../utils/validatorsFun.js";
import { tryCatch } from "../utils/tryCatch.js";
import { Blogs } from "../models/blogs.js";
import axios from "axios";
import { redisClient } from "../lib/redis.js";
dotenv.config();

const looksLikeObjectId = (value: string) => /^[a-f0-9]{24}$/i.test(value);

const resolveAuthorId = (blog: {
  author?: string;
  authorId?: string;
  authorName?: string;
}) => {
  if (blog.authorId) {
    return blog.authorId;
  }

  if (blog.author && looksLikeObjectId(blog.author)) {
    return blog.author;
  }

  return null;
};

const hydrateBlogAuthor = async (blog: any, authHeader?: string) => {
  const existingAuthorName =
    typeof blog.authorName === "string" && blog.authorName.trim()
      ? blog.authorName.trim()
      : typeof blog.author === "string" && !looksLikeObjectId(blog.author)
        ? blog.author.trim()
        : "";

  const authorId = resolveAuthorId(blog);

  if (!authorId) {
    return {
      ...blog,
      author: existingAuthorName || blog.author,
      authorId: blog.authorId || undefined,
      authorName: existingAuthorName || undefined,
    };
  }

  try {
    const requestConfig = authHeader
      ? {
          headers: {
            Authorization: authHeader,
          },
        }
      : {};

    const { data } = await axios.get(
      `${process.env.USER_SERVICE_URL}/user/${authorId}`,
      requestConfig,
    );

    const resolvedName =
      data?.user?.name || existingAuthorName || blog.authorName || blog.author;

    return {
      ...blog,
      author: resolvedName,
      authorId,
      authorName: resolvedName,
    };
  } catch {
    return {
      ...blog,
      author: existingAuthorName || blog.author,
      authorId,
      authorName: existingAuthorName || undefined,
    };
  }
};

export const getAllBlogs = tryCatch(async (req, res) => {
  const {
    search = "",
    author = "",
    category = "",
    tag = "",
    page = "1",
    limit = "25",
  } = req.query;

  const pageNumber = parseInt(page as string);
  const limitNumber = parseInt(limit as string);
  const skip = (pageNumber - 1) * limitNumber;

  const cacheKey = `blogs: ${search}:${category}:${author}:${tag}`;
  const cached = await redisClient.get(cacheKey);

  if (cached) {
    res.json(JSON.parse(cached));
    return;
  }

  const query: any = {};

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  if (author) {
    query.author = { $regex: author, $options: "i" };
  }

  if (category) {
    query.category = { $regex: category, $options: "i" };
  }

  if (tag) {
    query.tags = { $elemMatch: { $regex: tag, $options: "i" } };
  }

  const blogs = await Blogs.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber);

  const hydratedBlogs = await Promise.all(
    blogs.map((blog) =>
      hydrateBlogAuthor(blog.toObject(), req.headers.authorization),
    ),
  );

  const totalBlogs = await Blogs.countDocuments(query);

  await redisClient.set(
    cacheKey,
    JSON.stringify({
      pagination: {
        total: totalBlogs,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalBlogs / limitNumber),
      },
      blogs: hydratedBlogs,
    }),
    { EX: 3600 },
  );

  return res.status(200).json({
    message: "Blogs fetched successfully",
    pagination: {
      total: totalBlogs,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(totalBlogs / limitNumber),
    },
    blogs: hydratedBlogs,
  });
});

export const getBlogsById = tryCatch(async (req, res) => {
  const { id } = req.params;

  const idResult = validateRequiredFields(req.params, ["id"]);

  if (!idResult.isValid) {
    return res.status(400).json({
      message: "Missing required fields",
      missingFields: idResult.missing,
    });
  }

  const cacheKey = `blogs: ${id} `;
  const cached = await redisClient.get(cacheKey);

  if (cached) {
    console.log("serving single blog from redis cache");
    res.json(JSON.parse(cached));
    return;
  }

  const existingBlogs = await Blogs.findById(id);

  if (!existingBlogs) {
    return res.status(404).json({
      message: "Blog not found",
    });
  }

  const blogs = await Blogs.findById(id);

  if (!blogs) {
    return res.status(404).json({
      message: "Not able to fetch blog",
    });
  }

  const hydratedBlog = await hydrateBlogAuthor(
    blogs.toObject(),
    req.headers.authorization,
  );

  await redisClient.set(
    cacheKey,
    JSON.stringify({
      blogs: hydratedBlog,
      author: hydratedBlog.authorName
        ? {
            id: hydratedBlog.authorId,
            name: hydratedBlog.authorName,
          }
        : null,
    }),
    { EX: 3600 },
  );

  return res.status(200).json({
    message: "Blog found successfully",
    blogs: hydratedBlog,
    author: hydratedBlog.authorName
      ? {
          id: hydratedBlog.authorId,
          name: hydratedBlog.authorName,
        }
      : null,
  });
});
