"use client";

import Link from "next/link";
import { BookOpenText, Feather, LibraryBig } from "lucide-react";
import Footer from "@/app/components/common/Footer";
import Main from "@/app/components/common/Main";
import Navbar from "@/app/components/common/Navbar";
import { useTheme } from "@/app/theme/ThemeProvider";

const AboutPage = () => {
    const theme = useTheme();

    return (
        <div className="min-h-screen" style={{ background: theme.colors.beige }}>
            <Navbar />
            <Main>
                <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 md:px-10 md:py-14">
                    <div
                        className="rounded-4xl border px-6 py-10 md:px-10 md:py-14"
                        style={{
                            background: `linear-gradient(135deg, ${theme.colors.beige} 0%, ${theme.colors.white} 100%)`,
                            borderColor: theme.colors.lightGray,
                        }}
                    >
                        <p
                            className="text-xs uppercase tracking-[0.32em]"
                            style={{ color: theme.colors.amber, fontFamily: theme.font.body }}
                        >
                            About Blogger
                        </p>
                        <h1
                            className="mt-4 max-w-4xl text-4xl leading-tight md:text-6xl"
                            style={{ color: theme.colors.charcoal, fontFamily: theme.font.heading }}
                        >
                            A calm editorial space for ideas that deserve more than a quick post.
                        </h1>
                        <p
                            className="mt-5 max-w-3xl text-base leading-8 md:text-lg"
                            style={{ color: `${theme.colors.charcoal}A6`, fontFamily: theme.font.body }}
                        >
                            Blogger is built for thoughtful publishing. It brings writing, editing,
                            discovery, and long-form reading into one focused experience so creators
                            can shape better stories and readers can actually enjoy them.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {[
                            {
                                title: "Write with intent",
                                text: "Create articles with a rich editor, clean structure, and a workflow that supports real long-form publishing.",
                                icon: Feather,
                            },
                            {
                                title: "Discover meaningfully",
                                text: "Search, tags, categories, and detail pages are designed to help readers find the right story quickly.",
                                icon: LibraryBig,
                            },
                            {
                                title: "Read without noise",
                                text: "The interface leans editorial rather than crowded, so the content remains the focus from card to detail page.",
                                icon: BookOpenText,
                            },
                        ].map(({ title, text, icon: Icon }) => (
                            <div
                                key={title}
                                className="rounded-4xl border p-6"
                                style={{ background: theme.colors.white, borderColor: theme.colors.lightGray }}
                            >
                                <div
                                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-full"
                                    style={{ background: `${theme.colors.amber}1A`, color: theme.colors.amber }}
                                >
                                    <Icon size={20} />
                                </div>
                                <h2
                                    className="text-2xl"
                                    style={{ color: theme.colors.charcoal, fontFamily: theme.font.heading }}
                                >
                                    {title}
                                </h2>
                                <p
                                    className="mt-3 text-sm leading-7"
                                    style={{ color: `${theme.colors.charcoal}99`, fontFamily: theme.font.body }}
                                >
                                    {text}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div
                        className="rounded-4xl border p-8 md:p-10"
                        style={{ background: theme.colors.white, borderColor: theme.colors.lightGray }}
                    >
                        <h2
                            className="text-3xl md:text-4xl"
                            style={{ color: theme.colors.charcoal, fontFamily: theme.font.heading }}
                        >
                            Start reading or publish your own story
                        </h2>
                        <p
                            className="mt-3 max-w-2xl text-sm leading-7"
                            style={{ color: `${theme.colors.charcoal}99`, fontFamily: theme.font.body }}
                        >
                            Explore the latest collection from the homepage, or sign in and write
                            something worth keeping.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-4">
                            <Link
                                href="/"
                                className="rounded-full px-5 py-3 text-sm transition-opacity hover:opacity-85"
                                style={{
                                    background: theme.colors.charcoal,
                                    color: theme.colors.beige,
                                    fontFamily: theme.font.body,
                                }}
                            >
                                Go to Home
                            </Link>
                            <Link
                                href="/create-blog"
                                className="rounded-full border px-5 py-3 text-sm transition-colors hover:bg-white"
                                style={{
                                    borderColor: theme.colors.lightGray,
                                    color: theme.colors.charcoal,
                                    fontFamily: theme.font.body,
                                }}
                            >
                                Create Blog
                            </Link>
                        </div>
                    </div>
                </section>
            </Main>
            <Footer />
        </div>
    );
};

export default AboutPage;
