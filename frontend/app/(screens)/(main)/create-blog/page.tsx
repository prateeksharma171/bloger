"use client";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { FileText, ImageIcon, PenTool, Tag } from "lucide-react";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
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
import { createBlog, uploadCoverImage } from "@/app/api/blogs";

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

const BlogCreatePage = () => {
    const theme = useTheme();
    const router = useRouter();
    const { user, isAuthenticated, loading } = useAuth();
    const { Toast } = useToast();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace("/Login");
        }
    }, [isAuthenticated, loading, router]);

    const handleSubmit = async (
        values: BlogFormValues,
        {
            setSubmitting,
            resetForm,
        }: {
            setSubmitting: (isSubmitting: boolean) => void;
            resetForm: () => void;
        },
    ) => {
        if (!user?.id) {
            Toast({ type: "error", message: "You need to be signed in to publish." });
            return;
        }

        try {
            setSubmitting(true);
            await createBlog({
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

            Toast({ type: "success", message: "Blog published successfully." });
            resetForm();
            router.replace("/");
        } catch (error: unknown) {
            const message =
                typeof error === "object" &&
                    error !== null &&
                    "message" in error &&
                    typeof error.message === "string"
                    ? error.message
                    : "Unable to publish blog right now.";

            Toast({ type: "error", message });
        } finally {
            setSubmitting(false);
        }
    }

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
                                Create a new story
                            </p>
                            <h1
                                className="max-w-3xl text-4xl leading-tight md:text-6xl"
                                style={{ color: theme.colors.charcoal, fontFamily: theme.font.heading }}
                            >
                                Publish a blog with a rich editor and a clean editorial workflow.
                            </h1>
                            <p
                                className="max-w-2xl text-sm leading-7 md:text-base"
                                style={{ color: `${theme.colors.charcoal}B3`, fontFamily: theme.font.body }}
                            >
                                Build the title, summary, cover image, tags, and full story body in one place, then send it directly to your author service.
                            </p>
                        </div>

                        <div
                            className="grid gap-4 rounded-3xl border p-6 sm:grid-cols-2"
                            style={{ background: `${theme.colors.white}CC`, borderColor: theme.colors.lightGray }}
                        >
                            {[
                                { title: "Rich body", text: "Format headings, lists, bold text, and links with CKEditor.", icon: PenTool },
                                { title: "Structured tags", text: "Keep discovery friendly with category and tags.", icon: Tag },
                                { title: "Cover ready", text: "Choose a file from your system and upload it as the blog hero image.", icon: ImageIcon },
                                { title: "Fast publish", text: "Everything posts through your author service endpoint.", icon: FileText },
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

                    <Formik
                        initialValues={{
                            title: "",
                            description: "",
                            category: "",
                            image: "",
                            tags: "",
                            content: "",
                        }}
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
                                                Define the article frame
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
                                            <BlogTextField name="category" label="Category" placeholder="Technology, Travel, Design..." />
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
                                            <BlogTagsField name="tags" label="Tags" placeholder="react, nextjs, ui, writing" />
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
                                                Shape the full story
                                            </h2>
                                        </div>

                                        <BlogContentEditor name="content" label="Body" />

                                        <div
                                            className="mt-6 rounded-3xl border p-4"
                                            style={{ borderColor: theme.colors.lightGray, background: theme.colors.beige }}
                                        >
                                            <p
                                                className="text-xs uppercase tracking-[0.2em]"
                                                style={{ color: theme.colors.amber, fontFamily: theme.font.body }}
                                            >
                                                Publishing note
                                            </p>
                                            <p
                                                className="mt-2 text-sm leading-6"
                                                style={{ color: `${theme.colors.charcoal}99`, fontFamily: theme.font.body }}
                                            >
                                                The current backend stores the author as the signed-in user id. If you later want names or avatars on list views, we can hydrate or denormalize that data too.
                                            </p>
                                        </div>
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
                                            onClick={() => router.push("/")}
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
                                                        message: "Please complete all required blog fields before publishing.",
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
                                                        message: "Add some blog content before publishing.",
                                                    });
                                                    return;
                                                }

                                                await submitForm();
                                            }}
                                        >
                                            Publish Blog
                                        </Button>
                                    </div>
                                </motion.div>
                            </Form>
                        )}
                    </Formik>
                </section>
            </Main>
            <Footer />
        </div>
    );
};

export default BlogCreatePage;
