"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3, PencilLine, Tag, Trash2 } from "lucide-react";
import { deleteBlog, getBlogById } from "@/app/api/blogs";
import { isRequestCanceled } from "@/app/api/axiosInstance";
import Dialog from "@/app/components/common/Dialog";
import Footer from "@/app/components/common/Footer";
import Main from "@/app/components/common/Main";
import Navbar from "@/app/components/common/Navbar";
import { useAuth } from "@/app/context/authContext";
import { useToast } from "@/app/providers/ToastProvider";
import { useTheme } from "@/app/theme/ThemeProvider";
import type { Blog } from "@/app/components/common/BlogCard";

const readTime = (content: string) =>
    Math.max(1, Math.ceil(content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length / 200));

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

const BlogDetailPage = () => {
    const theme = useTheme();
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const { isAuthenticated, loading, user } = useAuth();
    const { Toast } = useToast();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [isLoadingBlog, setIsLoadingBlog] = useState(false);
    const [isDeletingBlog, setIsDeletingBlog] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [error, setError] = useState("");

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
            setError("");

            try {
                const response = await getBlogById(params.id, {
                    signal: controller.signal,
                });

                setBlog((response.data?.blogs ?? null) as Blog | null);
            } catch (err) {
                if (isRequestCanceled(err)) {
                    return;
                }

                const nextError =
                    err instanceof Error ? err.message : "We couldn't load this blog right now.";
                setError(nextError);
                setBlog(null);
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
    }, [isAuthenticated, loading, params?.id]);

    const displayAuthor = blog?.authorName || blog?.author || "Unknown Author";
    const isOwner =
        !!blog &&
        !!user?.id &&
        ((blog.authorId && blog.authorId === user.id) || blog.author === user.id);

    const handleDeleteBlog = async () => {
        if (!params?.id || isDeletingBlog) {
            return;
        }

        try {
            setIsDeletingBlog(true);
            await deleteBlog(params.id);
            Toast({ type: "success", message: "Blog deleted successfully." });
            setIsDeleteDialogOpen(false);
            router.replace("/");
        } catch (error: unknown) {
            const message =
                typeof error === "object" &&
                    error !== null &&
                    "message" in error &&
                    typeof error.message === "string"
                    ? error.message
                    : "Unable to delete this blog right now.";

            Toast({ type: "error", message });
        } finally {
            setIsDeletingBlog(false);
        }
    };

    return (
        <div className="min-h-screen" style={{ background: theme.colors.beige }}>
            <Navbar />
            <Main>
                <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10 md:px-10 md:py-14">
                    <div className="flex items-center justify-between gap-4">
                        <div
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-opacity hover:opacity-80"
                            style={{
                                borderColor: theme.colors.lightGray,
                                color: theme.colors.charcoal,
                                fontFamily: theme.font.body,
                            }}
                        >
                            <ArrowLeft size={15} />
                            Back to home
                        </div>
                        {isOwner ? (
                            <div className="flex flex-wrap items-center gap-3">
                                <Link
                                    href={`/blogs/${params.id}/edit`}
                                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-opacity hover:opacity-85"
                                    style={{
                                        background: theme.colors.charcoal,
                                        color: theme.colors.beige,
                                        fontFamily: theme.font.body,
                                    }}
                                >
                                    <PencilLine size={15} />
                                    Edit Blog
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => setIsDeleteDialogOpen(true)}
                                    disabled={isDeletingBlog}
                                    className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
                                    style={{
                                        borderColor: `${theme.colors.amber}66`,
                                        color: "#B74545",
                                        fontFamily: theme.font.body,
                                        background: theme.colors.white,
                                    }}
                                >
                                    <Trash2 size={15} />
                                    {isDeletingBlog ? "Deleting..." : "Delete Blog"}
                                </button>
                            </div>
                        ) : null}
                    </div>

                    {isLoadingBlog ? (
                        <div
                            className="overflow-hidden rounded-4xl border"
                            style={{ background: theme.colors.white, borderColor: theme.colors.lightGray }}
                        >
                            <div className="aspect-16/8 animate-pulse bg-black/10" />
                            <div className="space-y-4 p-8">
                                <div className="h-4 w-28 animate-pulse rounded bg-black/10" />
                                <div className="h-12 w-4/5 animate-pulse rounded bg-black/10" />
                                <div className="h-4 w-full animate-pulse rounded bg-black/10" />
                                <div className="h-4 w-3/4 animate-pulse rounded bg-black/10" />
                            </div>
                        </div>
                    ) : null}

                    {!isLoadingBlog && error ? (
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
                                {error}
                            </p>
                        </div>
                    ) : null}

                    {!isLoadingBlog && !error && blog ? (
                        <article
                            className="overflow-hidden rounded-4xl border"
                            style={{ background: theme.colors.white, borderColor: theme.colors.lightGray }}
                        >
                            <div className="relative aspect-16/8 w-full" style={{ background: `${theme.colors.charcoal}12` }}>
                                {blog.image ? (
                                    <Image
                                        src={blog.image}
                                        alt={blog.title}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                ) : null}
                                <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center gap-3">
                                    <span
                                        className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em]"
                                        style={{
                                            background: theme.colors.amber,
                                            color: theme.colors.beige,
                                            fontFamily: theme.font.body,
                                        }}
                                    >
                                        {blog.category}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-8 p-6 md:p-10">
                                <div className="space-y-5">
                                    <p
                                        className="text-xs uppercase tracking-[0.28em]"
                                        style={{ color: theme.colors.amber, fontFamily: theme.font.body }}
                                    >
                                        Full story
                                    </p>
                                    <h1
                                        className="max-w-4xl text-4xl leading-tight md:text-6xl"
                                        style={{ color: theme.colors.charcoal, fontFamily: theme.font.heading }}
                                    >
                                        {blog.title}
                                    </h1>
                                    <p
                                        className="max-w-3xl text-base leading-8 md:text-lg"
                                        style={{ color: `${theme.colors.charcoal}A6`, fontFamily: theme.font.body }}
                                    >
                                        {blog.description}
                                    </p>
                                </div>

                                <div
                                    className="flex flex-wrap items-center gap-5 border-y py-5"
                                    style={{ borderColor: `${theme.colors.charcoal}14` }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="flex h-11 w-11 items-center justify-center rounded-full"
                                            style={{ background: theme.colors.charcoal }}
                                        >
                                            <span
                                                className="text-sm font-semibold"
                                                style={{ color: theme.colors.beige, fontFamily: theme.font.body }}
                                            >
                                                {displayAuthor.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p
                                                className="text-sm font-semibold"
                                                style={{ color: theme.colors.charcoal, fontFamily: theme.font.body }}
                                            >
                                                {displayAuthor}
                                            </p>
                                            <p
                                                className="text-xs"
                                                style={{ color: `${theme.colors.charcoal}73`, fontFamily: theme.font.body }}
                                            >
                                                Author
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm" style={{ color: `${theme.colors.charcoal}80` }}>
                                        <CalendarDays size={16} />
                                        <span style={{ fontFamily: theme.font.body }}>{formatDate(blog.createdAt)}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm" style={{ color: `${theme.colors.charcoal}80` }}>
                                        <Clock3 size={16} />
                                        <span style={{ fontFamily: theme.font.body }}>{readTime(blog.content)} min read</span>
                                    </div>
                                </div>

                                {blog.tags?.length ? (
                                    <div className="flex flex-wrap gap-2">
                                        {blog.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs"
                                                style={{
                                                    borderColor: theme.colors.lightGray,
                                                    color: `${theme.colors.charcoal}99`,
                                                    fontFamily: theme.font.body,
                                                }}
                                            >
                                                <Tag size={12} />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                ) : null}

                                <div
                                    className="blog-detail-content"
                                    style={{ color: theme.colors.charcoal, fontFamily: theme.font.body }}
                                    dangerouslySetInnerHTML={{ __html: blog.content }}
                                />
                            </div>
                        </article>
                    ) : null}
                </section>
            </Main>
            <Dialog
                open={isDeleteDialogOpen}
                title="Delete this blog?"
                description="This permanently removes the article from your blog feed and detail pages. You cannot undo this action."
                confirmLabel="Delete Blog"
                cancelLabel="Keep Blog"
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteBlog}
                loading={isDeletingBlog}
                destructive
                confirmDisabled={!blog}
                cancelDisabled={isDeletingBlog}
                closeOnOverlayClick={!isDeletingBlog}
                showCloseButton={!isDeletingBlog}
                confirmIcon={<Trash2 size={15} />}
            >
                <div
                    className="rounded-3xl border px-4 py-4"
                    style={{ borderColor: `${theme.colors.amber}33`, background: `${theme.colors.amber}12` }}
                >
                    <p
                        className="text-xs uppercase tracking-[0.2em]"
                        style={{ color: theme.colors.amber, fontFamily: theme.font.body }}
                    >
                        Deleting now
                    </p>
                    <p
                        className="mt-2 text-sm leading-7"
                        style={{ color: `${theme.colors.charcoal}99`, fontFamily: theme.font.body }}
                    >
                        <span style={{ color: theme.colors.charcoal, fontWeight: 600 }}>
                            {blog?.title || "This blog"}
                        </span>{" "}
                        will be removed for all readers.
                    </p>
                </div>
            </Dialog>
            <Footer />
        </div>
    );
};

export default BlogDetailPage;
