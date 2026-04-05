"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/app/theme/ThemeProvider";
import { useAuth } from "@/app/context/authContext";

const navLinks = [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Create Blog", href: "/create-blog" },
];

const Navbar = () => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const { isAuthenticated, user, logout, loading } = useAuth();

    return (
        <nav
            className="fixed top-0 left-0 z-50 w-full border-b"
            style={{
                height: "var(--site-header-height)",
                background: theme.colors.beige,
                borderColor: theme.colors.lightGray,
                fontFamily: theme.font.heading,
            }}
        >
            <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
                {/* Logo */}
                <Link href="/" className="flex flex-col leading-tight">
                    <span
                        className="text-[10px] tracking-[0.3em] uppercase"
                        style={{ color: theme.colors.amber }}
                    >
                        Est. 2024
                    </span>
                    <span
                        className="text-xl font-bold tracking-tight"
                        style={{ color: theme.colors.charcoal }}
                    >
                        Blogger
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="text-sm tracking-wide transition-opacity hover:opacity-60"
                            style={{
                                color: theme.colors.charcoal,
                                fontFamily: theme.font.body,
                            }}
                        >
                            {item.title}
                        </Link>
                    ))}
                </div>

                {/* Right Side */}
                <div className="hidden md:flex items-center gap-6">
                    {loading ? null : isAuthenticated ? (
                        <>
                            <span
                                className="text-sm"
                                style={{
                                    color: theme.colors.charcoal,
                                    fontFamily: theme.font.body,
                                    opacity: 0.7,
                                }}
                            >
                                {user?.name}
                            </span>
                            <button
                                type="button"
                                onClick={() => void logout()}
                                className="px-4 py-2 text-sm border transition-all hover:opacity-80"
                                style={{
                                    borderColor: theme.colors.lightGray,
                                    color: theme.colors.charcoal,
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/Login"
                                className="text-sm"
                                style={{
                                    color: theme.colors.charcoal,
                                    fontFamily: theme.font.body,
                                    opacity: 0.6,
                                }}
                            >
                                Login
                            </Link>

                            <Link
                                href="/SignUp"
                                className="px-4 py-2 text-sm border transition-all hover:opacity-80"
                                style={{
                                    borderColor: theme.colors.lightGray,
                                    color: theme.colors.charcoal,
                                }}
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden" onClick={() => setOpen(!open)}>
                    {open ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            className="fixed inset-0 z-40"
                            style={{ background: theme.colors.lightGray }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="fixed top-0 left-0 h-screen w-full z-50 flex flex-col px-6 py-8"
                            style={{
                                background: theme.colors.beige,
                                fontFamily: theme.font.heading,
                            }}
                        >
                            {/* Top Bar */}
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex flex-col leading-tight">
                                    <span
                                        className="text-[10px] tracking-[0.3em] uppercase"
                                        style={{ color: theme.colors.amber }}
                                    >
                                        Est. 2024
                                    </span>
                                    <span
                                        className="text-xl font-bold"
                                        style={{ color: theme.colors.charcoal }}
                                    >
                                        Blogger
                                    </span>
                                </div>

                                <button onClick={() => setOpen(false)}>
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Nav Links */}
                            <div className="flex flex-col gap-8 text-2xl">
                                {navLinks.map((item) => (
                                    <Link
                                        key={item.title}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className="transition-opacity hover:opacity-60"
                                        style={{
                                            color: theme.colors.charcoal,
                                            fontFamily: theme.font.heading,
                                        }}
                                    >
                                        {item.title}
                                    </Link>
                                ))}
                            </div>

                            {/* Bottom Section */}
                            <div className="mt-auto flex flex-col gap-4 pt-10">
                                {loading ? null : isAuthenticated ? (
                                    <>
                                        <p
                                            className="text-sm"
                                            style={{
                                                color: theme.colors.charcoal,
                                                opacity: 0.6,
                                                fontFamily: theme.font.body,
                                            }}
                                        >
                                            Signed in as {user?.name}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setOpen(false);
                                                void logout();
                                            }}
                                            className="px-4 py-3 border text-center"
                                            style={{
                                                borderColor: theme.colors.lightGray,
                                            }}
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/Login"
                                            className="text-sm"
                                            style={{
                                                color: theme.colors.charcoal,
                                                opacity: 0.6,
                                                fontFamily: theme.font.body,
                                            }}
                                        >
                                            Login
                                        </Link>

                                        <Link
                                            href="/SignUp"
                                            className="px-4 py-3 border text-center"
                                            style={{
                                                borderColor: theme.colors.lightGray,
                                            }}
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
