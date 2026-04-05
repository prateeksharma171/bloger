import { Router } from "express";
import { isAuth } from "../middleware/isAuth.js";
import { createBlog, deleteBlog, updateBlog } from "../controllers/blogs.js";

const blogRouter = Router();

blogRouter.post("/create", isAuth, createBlog);
blogRouter.put("/update/:id", isAuth, updateBlog);
blogRouter.delete("/delete/:id", isAuth, deleteBlog);

export default blogRouter;
