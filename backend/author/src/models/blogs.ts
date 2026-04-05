import mongoose, { Document, Schema } from "mongoose";

export interface Blogs extends Document {
  title: string;
  description: string;
  content: string;
  image: string;
  author: string;
  authorId: string;
  authorName: string;
  category: string;
  tags: string[];
}

export interface Comments extends Document {
  comment: string;
  blogId: string;
  userId: string;
  username: string;
}

export interface saveBlogs extends Document {
  userId: string;
  blogId: string;

}

const blogSchema: Schema<Blogs> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    author: { type: String },
    authorId: { type: String },
    authorName: { type: String },
    category: { type: String },
    tags: { type: [String] },
  },
  { timestamps: true },
);

const commentsSchema: Schema<Comments> = new Schema(
  {
    comment: { type: String, required: true },
    blogId: { type: String, required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
  },
  { timestamps: true },
);

const saveBlogsSchema: Schema<saveBlogs> = new Schema(
  {
    blogId: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true },
);

export const Blogs = mongoose.model<Blogs>("Blogs", blogSchema);
export const Comments = mongoose.model<Comments>("Comments", commentsSchema);
export const saveBlogs = mongoose.model<saveBlogs>("saveBlogs", saveBlogsSchema);

