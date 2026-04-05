"use client";

import Link from "next/link";
import Navbar from "@/app/components/common/Navbar";
import Main from "@/app/components/common/Main";
import Footer from "@/app/components/common/Footer";
import { useTheme } from "@/app/theme/ThemeProvider";

const NotFoundPage = () => {
    const theme = useTheme();

    return (
        <div className="min-h-screen" style={{ background: theme.colors.beige }}>
            <Navbar />
            <Main>
                <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10 md:px-10 md:py-16">
                    <div
                        className="rounded-4xl border px-8 py-14 text-center md:px-12 md:py-20"
                        style={{
                            background: `linear-gradient(135deg, ${theme.colors.beige} 0%, ${theme.colors.white} 100%)`,
                            borderColor: theme.colors.lightGray,
                        }}
                    >
                        <p
                            className="text-xs uppercase tracking-[0.34em]"
                            style={{ color: theme.colors.amber, fontFamily: theme.font.body }}
                        >
                            404
                        </p>
                        <h1
                            className="mt-4 text-4xl leading-tight md:text-6xl"
                            style={{ color: theme.colors.charcoal, fontFamily: theme.font.heading }}
                        >
                            That page doesn&apos;t exist.
                        </h1>
                        <p
                            className="mx-auto mt-5 max-w-2xl text-sm leading-7 md:text-base"
                            style={{ color: `${theme.colors.charcoal}99`, fontFamily: theme.font.body }}
                        >
                            The path you opened isn&apos;t available right now. Use the links below
                            to get back to a safe page.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                            <Link
                                href="/"
                                className="rounded-full px-5 py-3 text-sm transition-opacity hover:opacity-85"
                                style={{
                                    background: theme.colors.charcoal,
                                    color: theme.colors.beige,
                                    fontFamily: theme.font.body,
                                }}
                            >
                                Back to Home
                            </Link>
                            <Link
                                href="/about"
                                className="rounded-full border px-5 py-3 text-sm transition-colors hover:bg-white"
                                style={{
                                    borderColor: theme.colors.lightGray,
                                    color: theme.colors.charcoal,
                                    fontFamily: theme.font.body,
                                }}
                            >
                                Visit About
                            </Link>
                        </div>
                    </div>
                </section>
            </Main>
            <Footer />
        </div>
    );
};

export default NotFoundPage;
