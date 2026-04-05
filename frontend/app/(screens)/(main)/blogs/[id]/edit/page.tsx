"use client";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { FileText, ImageIcon, PenTool, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/common/Navbar";
import Main from "@/app/components/common/Main";
import Footer from "@/app/components/common/Footer";
import Button from "@/app/components/common/Button";
import BlogTextField from "@/app/components/blog-form/BlogTextField";
import BlogTextareaField from "@/app/components/blog-form/BlogTextareaField";
import BlogTagsField, { normalizeTags } from "@/app/components/blog-form/BlogTagsField";
import BlogCoverImageField from "@/app/components/blog-form/BlogCoverImageField";
import { useTheme } from "@/app/theme/ThemeProvider";
import { useAuth } from "@/app/context/authContext";
import { useToast } from "@/app/providers/ToastProvider";
import { getBlogById, updateBlog, uploadCoverImage } from "@/app/api/blogs";
import { isRequestCanceled } from "@/app/api/axiosInstance";
import type { Blog } from "@/app/components/common/BlogCard";

const BlogContentEditor = dynamic(
    () => import("@/app/components/blog-form/BlogContentEditor"),
    { ssr: false },
);

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1] as const,
        delay,
    },
});

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, "").trim();

type BlogFormValues = {
    title: string;
    description: string;
    category: string;
    image: string;
    tags: string;
    content: string;
};

const schema = Yup.object({
    title: Yup.string().min(6, "Add a stronger title").required("Title is required"),
    description: Yup.string()
        .min(20, "Write at least 20 characters")
        .required("Description is required"),
    category: Yup.string().required("Category is required"),
    image: Yup.string().required("Cover image is required"),
    tags: Yup.string()
        .test("tags", "Add at least one tag", (value) => normalizeTags(value ?? "").length > 0)
        .required("Tags are required"),
    content: Yup.string()
        .test("content", "Body is required", (value) => stripHtml(value ?? "").length > 0)
        .required("Body is required"),
});

const defaultValues: BlogFormValues = {
    title: "",
    description: "",
    category: "",
    image: "",
    tags: "",
    content: "",
};

const EditBlogPage = () => {
    const theme = useTheme();
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const { user, isAuthenticated, loading } = useAuth();
    const { Toast } = useToast();
    const [initialValues, setInitialValues] = useState<BlogFormValues>(defaultValues);
    const [isLoadingBlog, setIsLoadingBlog] = useState(true);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace("/Login");
        }
    }, [isAuthenticated, loading, router]);

    useEffect(() => {
        if (loading || !isAuthenticated || !params?.id) {
            return;
        }

        const controller = new AbortController();

        const loadBlog = async () => {
            setIsLoadingBlog(true);
            setLoadError("");

            try {
                const response = await getBlogById(params.id, {
                    signal: controller.signal,
                });

                const blog = (response.data?.blogs ?? null) as Blog | null;

                if (!blog) {
                    throw new Error("Blog not found.");
                }

                const ownerId = blog.authorId || (blog.author?.length === 24 ? blog.author : "");
                if (user?.id && ownerId && ownerId !== user.id) {
                    Toast({
                        type: "error",
                        message: "You can only edit your own blogs.",
                    });
                    router.replace(`/blogs/${params.id}`);
                    return;
                }

                setInitialValues({
                    title: blog.title || "",
                    description: blog.description || "",
                    category: blog.category || "",
                    image: blog.image || "",
                    tags: (blog.tags ?? []).join(", "),
                    content: blog.content || "",
                });
            } catch (error: unknown) {
                if (isRequestCanceled(error)) {
                    return;
                }

                const message =
                    error instanceof Error ? error.message : "Unable to load this blog for editing.";
                setLoadError(message);
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoadingBlog(false);
                }
            }
        };

        void loadBlog();

        return () => {
            controller.abort();
        };
    }, [isAuthenticated, loading, params?.id, router, Toast, user?.id]);

    const handleSubmit = async (
        values: BlogFormValues,
        {
            setSubmitting,
        }: {
            setSubmitting: (isSubmitting: boolean) => void;
        },
    ) => {
        if (!user?.id || !params?.id) {
            Toast({ type: "error", message: "You need to be signed in to update this blog." });
            return;
        }

        try {
            setSubmitting(true);
            await updateBlog(params.id, {
                title: values.title.trim(),
                description: values.description.trim(),
                category: values.category.trim(),
                image: values.image.trim(),
                content: values.content,
                tags: normalizeTags(values.tags),
                author: user.name,
                authorId: user.id,
                authorName: user.name,
            });

            Toast({ type: "success", message: "Blog updated successfully." });
            router.replace(`/blogs/${params.id}`);
        } catch (error: unknown) {
            const message =
                typeof error === "object" &&
                    error !== null &&
                    "message" in error &&
                    typeof error.message === "string"
                    ? error.message
                    : "Unable to update blog right now.";

            Toast({ type: "error", message });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen" style={{ background: theme.colors.beige }}>
            <Navbar />
            <Main>
                <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 md:px-10 md:py-14">
                    <motion.div
                        {...fadeUp(0)}
                        className="grid gap-8 overflow-hidden rounded-4xl border p-8 md:grid-cols-[1fr_0.72fr]"
                        style={{
                            borderColor: theme.colors.lightGray,
                            background: `linear-gradient(135deg, ${theme.colors.beige} 0%, ${theme.colors.white} 100%)`,
                        }}
                    >
                        <div className="space-y-5">
                            <p
                                className="text-xs uppercase tracking-[0.3em]"
                                style={{ color: theme.colors.amber, fontFamily: theme.font.body }}
                            >
                                Refine your story
                            </p>
                            <h1
                                className="max-w-3xl text-4xl leading-tight md:text-6xl"
                                style={{ color: theme.colors.charcoal, fontFamily: theme.font.heading }}
                            >
                                Edit your blog without losing the editorial flow.
                            </h1>
                            <p
                                className="max-w-2xl text-sm leading-7 md:text-base"
                                style={{ color: `${theme.colors.charcoal}B3`, fontFamily: theme.font.body }}
                            >
                                Update the story details, replace the cover image, and revise the full body before publishing the new version.
                            </p>
                        </div>

                        <div
                            className="grid gap-4 rounded-3xl border p-6 sm:grid-cols-2"
                            style={{ background: `${theme.colors.white}CC`, borderColor: theme.colors.lightGray }}
                        >
                            {[
                                { title: "Revise body", text: "Improve the article with the same rich editor and sticky toolset.", icon: PenTool },
                                { title: "Refresh tags", text: "Use spaces or Enter to build cleaner tags as you type.", icon: Tag },
                                { title: "Replace cover", text: "Swap the existing image without leaving the editor.", icon: ImageIcon },
                                { title: "Save changes", text: "Send the updated article back through your author service.", icon: FileText },
                            ].map(({ title, text, icon: Icon }) => (
                                <div
                                    key={title}
                                    className="rounded-[1.25rem] border p-4"
                                    style={{ borderColor: theme.colors.lightGray, background: theme.colors.beige }}
                                >
                                    <div
                                        className="mb-4 flex h-10 w-10 items-center justify-center rounded-full"
                                        style={{ background: `${theme.colors.amber}1A`, color: theme.colors.amber }}
                                    >
                                        <Icon size={18} />
                                    </div>
                                    <h2
                                        className="text-lg"
                                        style={{ color: theme.colors.charcoal, fontFamily: theme.font.heading }}
                                    >
                                        {title}
                                    </h2>
                                    <p
                                        className="mt-2 text-sm leading-6"
                                        style={{ color: `${theme.colors.charcoal}99`, fontFamily: theme.font.body }}
                                    >
                                        {text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {isLoadingBlog ? (
                        <div
                            className="rounded-4xl border px-8 py-14 text-center"
                            style={{ background: theme.colors.white, borderColor: theme.colors.lightGray }}
                        >
                            <p style={{ color: theme.colors.charcoal, fontFamily: theme.font.heading }}>
                                Loading blog content...
                            </p>
                        </div>
                    ) : null}

                    {!isLoadingBlog && loadError ? (
                        <div
                            className="rounded-4xl border px-8 py-14 text-center"
                            style={{ background: theme.colors.white, borderColor: `${theme.colors.amber}4D` }}
                        >
                            <p
                                className="text-3xl"
                                style={{ color: theme.colors.charcoal, fontFamily: theme.font.heading }}
                            >
                                Unable to load this blog
                            </p>
                            <p
                                className="mt-3 text-sm"
                                style={{ color: `${theme.colors.charcoal}99`, fontFamily: theme.font.body }}
                            >
                                {loadError}
                            </p>
                        </div>
                    ) : null}

                    {!isLoadingBlog && !loadError ? (
                        <Formik
                            initialValues={initialValues}
                            enableReinitialize
                            validationSchema={schema}
                            onSubmit={handleSubmit}
                        >
                            {({
                                isSubmitting,
                                submitForm,
                                validateForm,
                                setTouched,
                                values,
                            }) => (
                                <Form className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                                    <motion.div {...fadeUp(0.1)} className="min-w-0 space-y-6">
                                        <div
                                            className="rounded-4xl border p-6 md:p-8"
                                            style={{ background: theme.colors.white, borderColor: theme.colors.lightGray }}
                                        >
                                            <div className="mb-6">
                                                <p
                                                    className="text-xs uppercase tracking-[0.25em]"
                                                    style={{ color: theme.colors.amber, fontFamily: theme.font.body }}
                                                >
                                                    Story details
                                                </p>
                                                <h2
                                                    className="mt-3 text-3xl"
                                                    style={{ color: theme.colors.charcoal, fontFamily: theme.font.heading }}
                                                >
                                                    Update the article frame
                                                </h2>
                                            </div>

                                            <div className="space-y-5">
                                                <BlogTextField name="title" label="Title" placeholder="Write a compelling headline" />
                                                <BlogTextareaField
                                                    name="description"
                                                    label="Description"
                                                    placeholder="Summarize the post in 1-2 lines"
                                                    rows={4}
                                                />
                                                <BlogTextField name="category" label="Category" placeholder="Technology Travel Design" />
                                                <BlogCoverImageField
                                                    name="image"
                                                    label="Cover Image"
                                                    onUpload={async (file) => {
                                                        try {
                                                            const response = await uploadCoverImage(file);
                                                            const url = response.data?.url;

                                                            if (!url || typeof url !== "string") {
                                                                throw new Error("Upload finished but no image URL was returned.");
                                                            }

                                                            Toast({
                                                                type: "success",
                                                                message: "Cover image uploaded successfully.",
                                                            });

                                                            return url;
                                                        } catch (error: unknown) {
                                                            const message =
                                                                typeof error === "object" &&
                                                                    error !== null &&
                                                                    "message" in error &&
                                                                    typeof error.message === "string"
                                                                    ? error.message
                                                                    : "Unable to upload cover image.";

                                                            Toast({ type: "error", message });
                                                            throw error;
                                                        }
                                                    }}
                                                />
                                                <BlogTagsField name="tags" label="Tags" placeholder="react nextjs ui writing" />
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div {...fadeUp(0.15)} className="min-w-0 space-y-6">
                                        <div
                                            className="rounded-4xl border p-6 md:p-8"
                                            style={{ background: theme.colors.white, borderColor: theme.colors.lightGray }}
                                        >
                                            <div className="mb-6">
                                                <p
                                                    className="text-xs uppercase tracking-[0.25em]"
                                                    style={{ color: theme.colors.amber, fontFamily: theme.font.body }}
                                                >
                                                    Blog body
                                                </p>
                                                <h2
                                                    className="mt-3 text-3xl"
                                                    style={{ color: theme.colors.charcoal, fontFamily: theme.font.heading }}
                                                >
                                                    Refine the full story
                                                </h2>
                                            </div>

                                            <BlogContentEditor name="content" label="Body" />
                                        </div>

                                        <div className="flex flex-col gap-4 sm:flex-row">
                                            <Button
                                                type="button"
                                                fullWidth={false}
                                                className="justify-center"
                                                disabled={isSubmitting}
                                                loading={isSubmitting}
                                                style={{
                                                    background: "transparent",
                                                    color: theme.colors.charcoal,
                                                    border: `1px solid ${theme.colors.lightGray}`,
                                                }}
                                                onClick={() => router.push(`/blogs/${params.id}`)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="button"
                                                loading={isSubmitting}
                                                disabled={isSubmitting || loading}
                                                onClick={async () => {
                                                    if (loading) {
                                                        Toast({
                                                            type: "error",
                                                            message: "Please wait while your session loads.",
                                                        });
                                                        return;
                                                    }

                                                    const errors = await validateForm();

                                                    if (Object.keys(errors).length > 0) {
                                                        setTouched({
                                                            title: true,
                                                            description: true,
                                                            category: true,
                                                            image: true,
                                                            tags: true,
                                                            content: true,
                                                        });
                                                        Toast({
                                                            type: "error",
                                                            message: "Please complete all required blog fields before saving.",
                                                        });
                                                        return;
                                                    }

                                                    if (!stripHtml(values.content).length) {
                                                        setTouched({
                                                            title: true,
                                                            description: true,
                                                            category: true,
                                                            image: true,
                                                            tags: true,
                                                            content: true,
                                                        });
                                                        Toast({
                                                            type: "error",
                                                            message: "Add some blog content before saving.",
                                                        });
                                                        return;
                                                    }

                                                    await submitForm();
                                                }}
                                            >
                                                Save Changes
                                            </Button>
                                        </div>
                                    </motion.div>
                                </Form>
                            )}
                        </Formik>
                    ) : null}
                </section>
            </Main>
            <Footer />
        </div>
    );
};

export default EditBlogPage;
