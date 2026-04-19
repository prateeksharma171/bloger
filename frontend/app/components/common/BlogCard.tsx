"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, ArrowUpRight, Bookmark, BookmarkCheck, AlertTriangle } from "lucide-react";
import { useTheme } from "@/app/theme/ThemeProvider";

// ─── Type ─────────────────────────────────────────────────────────────────────
export interface Blog {
    _id: string;
    title: string;
    description: string;
    content: string;
    image: string;
    author: string;
    authorId?: string;
    authorName?: string;
    category: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

interface BlogCardProps {
    blog: Blog;
    href: string;
    isBookmarked?: boolean;
    onBookmarkToggle?: (id: string, next: boolean) => void;
    loading?: boolean;
    error?: string;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });
}

function readTime(content: string) {
    return Math.max(1, Math.ceil(content.split(" ").length / 200));
}

const BlogCardError = ({ message }: { message: string }) => {
    const theme = useTheme();

    return (
        <div
            className="border rounded-sm p-8 flex flex-col items-center gap-3 text-center"
            style={{ background: theme.colors.beige, borderColor: `${theme.colors.amber}4D` }}
        >
            <div className="w-10 h-0.5 rounded" style={{ background: theme.colors.amber }} />
            <AlertTriangle size={20} color={theme.colors.amber} strokeWidth={1.5} />
            <p
                className="text-sm max-w-[220px] leading-relaxed"
                style={{ color: `${theme.colors.charcoal}80`, fontFamily: theme.font.body }}
            >
                {message}
            </p>
        </div>
    );
};

const BlogCard = ({
    blog,
    href,
    isBookmarked = false,
    onBookmarkToggle,
    loading,
    error,
}: BlogCardProps) => {
    const theme = useTheme();
    const [bookmarked, setBookmarked] = useState(isBookmarked);
    const [imgError, setImgError] = useState(false);

    if (error) return <BlogCardError message={error} />;

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const next = !bookmarked;
        setBookmarked(next);
        onBookmarkToggle?.(blog._id, next);
    };

    const displayAuthor = blog.authorName || blog.author || "Unknown Author";
    const authorInitial = displayAuthor.charAt(0).toUpperCase();

    return (
        <div
            className="group border rounded-sm overflow-hidden transition-shadow duration-300 hover:shadow-[0_16px_48px_rgba(28,28,28,0.12)]"
            style={{ background: theme.colors.beige, borderColor: theme.colors.lightGray }}
        >

            <div
                className="h-0.5 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
                style={{ background: theme.colors.amber }}
            />

            <Link href={href} className="block no-underline text-inherit">

                {/* Cover image */}
                <div className="relative aspect-video overflow-hidden" style={{ background: `${theme.colors.charcoal}12` }}>
                    {!imgError ? (
                        <img
                            src={blog.image}
                            alt={blog.title}
                            onError={() => setImgError(true)}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span
                                className="text-[10px] tracking-widest uppercase"
                                style={{ color: `${theme.colors.charcoal}4D`, fontFamily: theme.font.body }}
                            >
                                Image unavailable
                            </span>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

                    {/* Bookmark button */}
                    <button
                        onClick={handleBookmark}
                        className="absolute top-3 right-3 w-8 h-8 rounded-sm flex items-center justify-center shadow-md transition-colors duration-200"
                        style={{ background: bookmarked ? theme.colors.amber : `${theme.colors.beige}E6` }}
                        aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
                    >
                        {bookmarked
                            ? <BookmarkCheck size={14} color={theme.colors.beige} strokeWidth={2} />
                            : <Bookmark size={14} color={theme.colors.charcoal} strokeWidth={1.8} />
                        }
                    </button>

                    <div
                        className="absolute bottom-3 left-3 px-2.5 py-1 rounded-[2px]"
                        style={{ background: theme.colors.amber }}
                    >
                        <span
                            className="text-[9px] tracking-[0.2em] uppercase font-semibold"
                            style={{ color: theme.colors.beige, fontFamily: theme.font.body }}
                        >
                            {blog.category}
                        </span>
                    </div>
                </div>

                {/* Card body */}
                <div className="p-5">

                    {/* Read time */}
                    <div className="flex items-center gap-1.5 mb-3">
                        <Clock size={11} strokeWidth={1.8} style={{ color: `${theme.colors.charcoal}66` }} />
                        <span
                            className="text-[11px] tracking-wide"
                            style={{ color: `${theme.colors.charcoal}66`, fontFamily: theme.font.body }}
                        >
                            {readTime(blog.content)} min read
                        </span>
                    </div>

                    <h3
                        className="font-bold text-[18px] leading-snug tracking-tight mb-2 line-clamp-2"
                        style={{ fontFamily: theme.font.heading, color: theme.colors.charcoal }}
                    >
                        {blog.title}
                    </h3>

                    <p
                        className="text-[13px] leading-relaxed font-light line-clamp-2 mb-4"
                        style={{ color: `${theme.colors.charcoal}80`, fontFamily: theme.font.body }}
                    >
                        {blog.description}
                    </p>

                    {blog.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {blog.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="text-[10px] px-2 py-0.5 border rounded-[2px] tracking-wide"
                                    style={{
                                        borderColor: `${theme.colors.charcoal}26`,
                                        color: `${theme.colors.charcoal}73`,
                                        fontFamily: theme.font.body,
                                    }}
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="h-px mb-4" style={{ background: `${theme.colors.charcoal}12` }} />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div
                                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ background: theme.colors.charcoal }}
                            >
                                <span
                                    className="text-[11px] font-bold"
                                    style={{ color: theme.colors.beige, fontFamily: theme.font.body }}
                                >
                                    {authorInitial}
                                </span>
                            </div>
                            <div>
                                <p
                                    className="text-[12px] font-semibold leading-none"
                                    style={{ color: theme.colors.charcoal, fontFamily: theme.font.body }}
                                >
                                    {displayAuthor}
                                </p>
                                <p
                                    className="text-[10px] mt-0.5 tracking-wide"
                                    style={{ color: `${theme.colors.charcoal}66`, fontFamily: theme.font.body }}
                                >
                                    {formatDate(blog.createdAt)}
                                </p>
                            </div>
                        </div>

                        <div
                            className="w-7 h-7 rounded-sm border flex items-center justify-center transition-all duration-200 group-hover:border-transparent"
                            style={{ borderColor: `${theme.colors.charcoal}33` }}
                        >
                            <ArrowUpRight
                                size={13}
                                strokeWidth={2}
                                className="transition-colors duration-200 group-hover:text-[#F5F0E8]"
                                style={{ color: theme.colors.charcoal }}
                            />
                        </div>
                    </div>

                </div>
            </Link>
        </div>
    );
};

export default BlogCard;
