import api from "./axiosInstance";

type BlogQuery = {
  search?: string;
  author?: string;
  category?: string;
  tag?: string;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
};

type GetBlogByIdOptions = {
  signal?: AbortSignal;
};

type CreateBlogPayload = {
  title: string;
  description: string;
  content: string;
  image: string;
  author: string;
  authorId?: string;
  authorName?: string;
  category: string;
  tags: string[];
};

export const getAllBlogs = async (query: BlogQuery = {}) => {
  const { signal, ...paramsSource } = query;

  const params = Object.fromEntries(
    Object.entries(paramsSource).filter(
      ([, value]) => value !== undefined && value !== "",
    ),
  );

  return api.get("/blogs", {
    params,
    signal,
    service: "blog",
  });
};

export const getBlogById = async (
  id: string,
  options: GetBlogByIdOptions = {},
) =>
  api.get(`/blogs/${id}`, {
    signal: options.signal,
    service: "blog",
  });

export const createBlog = async (payload: CreateBlogPayload) =>
  api.post("/create", payload, { service: "author" });

export const updateBlog = async (id: string, payload: CreateBlogPayload) =>
  api.put(`/update/${id}`, payload, { service: "author" });

export const deleteBlog = async (id: string) =>
  api.delete(`/delete/${id}`, { service: "author" });

export const uploadCoverImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/upload", formData, {
    service: "author",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
