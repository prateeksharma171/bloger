"use client";

import Link from "next/link";
import { useTheme } from "@/app/theme/ThemeProvider";

const Footer = () => {
    const theme = useTheme();
    const exploreLinks = [
        { label: "Home", href: "/" },
        { label: "Articles", href: "/#browse-collection" },
        { label: "Categories", href: "/#browse-collection" },
        { label: "About", href: "/about" },
    ];

    return (
        <footer
            className="w-full border-t mt-20"
            style={{
                background: theme.colors.beige,
                borderColor: theme.colors.lightGray,
                fontFamily: theme.font.heading,
            }}
        >
            <div className="max-w-7xl mx-auto px-6 py-16">

                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* Brand */}
                    <div>
                        <p
                            className="text-xs tracking-[0.3em] uppercase mb-2"
                            style={{ color: theme.colors.amber }}
                        >
                            Est. 2024
                        </p>

                        <h2
                            className="text-2xl font-bold tracking-tight mb-4"
                            style={{ color: theme.colors.charcoal }}
                        >
                            Blogger
                        </h2>

                        <p
                            className="text-sm leading-relaxed max-w-xs"
                            style={{
                                color: theme.colors.charcoal,
                                opacity: 0.6,
                                fontFamily: theme.font.body,
                            }}
                        >
                            A modern platform for thinkers, writers, and creators to
                            share meaningful stories with the world.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4
                            className="text-sm mb-4 uppercase tracking-wider"
                            style={{ color: theme.colors.charcoal }}
                        >
                            Explore
                        </h4>

                        <div className="flex flex-col gap-3 text-sm">
                            {exploreLinks.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="transition-opacity hover:opacity-60"
                                    style={{
                                        color: theme.colors.charcoal,
                                        fontFamily: theme.font.body,
                                    }}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4
                            className="text-sm mb-4 uppercase tracking-wider"
                            style={{ color: theme.colors.charcoal }}
                        >
                            Resources
                        </h4>

                        <div className="flex flex-col gap-3 text-sm">
                            {["Privacy Policy", "Terms", "Contact"].map((item) => (
                                <Link
                                    key={item}
                                    href="/"
                                    className="transition-opacity hover:opacity-60"
                                    style={{
                                        color: theme.colors.charcoal,
                                        fontFamily: theme.font.body,
                                    }}
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4
                            className="text-sm mb-4 uppercase tracking-wider"
                            style={{ color: theme.colors.charcoal }}
                        >
                            Stay Updated
                        </h4>

                        <p
                            className="text-sm mb-4"
                            style={{
                                color: theme.colors.charcoal,
                                opacity: 0.6,
                                fontFamily: theme.font.body,
                            }}
                        >
                            Get the latest articles and insights delivered weekly.
                        </p>

                        <div className="flex border" style={{ borderColor: theme.colors.lightGray }}>
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-3 py-2 text-sm outline-none bg-transparent"
                                style={{
                                    fontFamily: theme.font.body,
                                }}
                            />
                            <button
                                className=" px-4 text-sm"
                                style={{
                                    background: theme.colors.charcoal,
                                    color: theme.colors.beige,
                                }}
                            >
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div
                    className="my-12 h-px"
                    style={{ background: theme.colors.lightGray }}
                />

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                    <p
                        className="text-xs"
                        style={{
                            color: theme.colors.charcoal,
                            opacity: 0.5,
                            fontFamily: theme.font.body,
                        }}
                    >
                        © {new Date().getFullYear()} Blogger. All rights reserved.
                    </p>

                    <div className="flex gap-6 text-xs">
                        {["Twitter", "Instagram", "LinkedIn"].map((item) => (
                            <Link
                                key={item}
                                href="/"
                                className="transition-opacity hover:opacity-60"
                                style={{
                                    color: theme.colors.charcoal,
                                    fontFamily: theme.font.body,
                                }}
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
