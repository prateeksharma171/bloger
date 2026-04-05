import { Router } from "express";
import { isAuth } from "../middleware/isAuth.js";
import { getAllBlogs, getBlogsById } from "../controllers/blogs.js";

const blogRouter = Router();

blogRouter.get("/blogs", isAuth, getAllBlogs);
blogRouter.get("/blogs/:id", isAuth, getBlogsById);

export default blogRouter;
