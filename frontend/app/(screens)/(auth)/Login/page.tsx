"use client";

import { Formik, Form } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import InputField from "@/app/components/common/InputField";
import Link from "next/link";
import Button from "@/app/components/common/Button";
import { useTheme } from "@/app/theme/ThemeProvider";
import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/providers/ToastProvider";
import { useEffect } from "react";

const schema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Min 6 characters").required("Required"),
});

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
        delay,
    },
});

const LoginPage = () => {
    const { login, isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const theme = useTheme()
    const { Toast } = useToast();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.replace("/");
        }
    }, [isAuthenticated, loading, router]);

    const handleSubmit = async (
        values: { email: string; password: string },
        { setSubmitting }: FormikHelpers<{ email: string; password: string }>,
    ) => {
        try {
            setSubmitting(true)
            const credentials = {
                email: values.email,
                password: values.password,
            };
            await login(credentials);
            Toast({ message: "Login successful", type: "success" });
            router.replace("/");
        } catch (error: unknown) {
            const message =
                typeof error === "object" &&
                    error !== null &&
                    "message" in error &&
                    typeof error.message === "string"
                    ? error.message
                    : "Login failed. Please try again.";
            Toast({
                message,
                type: "error",
            });
        } finally {
            setSubmitting(false)
        }
    };
    return (
        <div
            className="min-h-screen flex"
            style={{
                background: theme.colors.beige,
                fontFamily: theme.font.heading,
            }}
        >
            {/* ── LEFT PANEL ─────────────────────────────────────────── */}
            <div
                className="hidden lg:flex flex-col justify-between w-5/12 p-12 relative overflow-hidden"
                style={{ background: theme.colors.charcoal }}
            >
                {/* Subtle grain overlay */}
                <div
                    className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                        backgroundSize: "180px",
                    }}
                />

                {/* Amber accent line */}
                <div
                    className="absolute top-0 left-12 w-px h-40"
                    style={{ background: theme.colors.amber }}
                />

                {/* Top: Logo mark */}
                <motion.div {...fadeUp(0)} className="relative z-10">
                    <div
                        className="text-xs tracking-[0.3em] uppercase mb-1"
                        style={{ color: theme.colors.amber }}
                    >
                        Est. 2024
                    </div>
                    <div
                        className="text-2xl font-bold tracking-tight"
                        style={{ color: theme.colors.beige }}
                    >
                        Blogger
                    </div>
                </motion.div>

                {/* Middle: Big editorial quote */}
                <motion.div {...fadeUp(0.15)} className="relative z-10">
                    <p
                        className="text-5xl font-bold leading-[1.1] tracking-tight mb-8"
                        style={{ color: theme.colors.beige }}
                    >
                        Every great
                        <br />
                        journey starts
                        <br />
                        <span style={{ color: theme.colors.amber }}>with one step.</span>
                    </p>
                    <p
                        className="text-sm leading-relaxed max-w-xs"
                        style={{
                            color: theme.colors.beige,
                            opacity: 0.5,
                            fontFamily: theme.font.body,
                            fontWeight: 300,
                        }}
                    >
                        Join thousands of creators who trust our platform to bring their
                        ideas to life.
                    </p>
                </motion.div>

                {/* Bottom: Social proof */}
                <motion.div {...fadeUp(0.3)} className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {[theme.colors.beige, theme.colors.amber, theme.colors.charcoal].map((bg, i) => (
                                <div
                                    key={i}
                                    className="w-8 h-8 rounded-full border-2"
                                    style={{
                                        background: bg,
                                        borderColor: theme.colors.charcoal,
                                    }}
                                />
                            ))}
                        </div>
                        <p
                            className="text-xs"
                            style={{
                                color: theme.colors.beige,
                                opacity: 0.5,
                                fontFamily: theme.font.body,
                            }}
                        >
                            12,000+ members and growing
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* ── RIGHT PANEL ────────────────────────────────────────── */}
            <div className="flex flex-1 items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <motion.div {...fadeUp(0.1)} className="mb-10">
                        <p
                            className="text-xs tracking-[0.25em] uppercase mb-3"
                            style={{
                                color: theme.colors.amber,
                                fontFamily: theme.font.body,
                                fontWeight: 500,
                            }}
                        >
                            Login to your account
                        </p>
                        <h2
                            className="text-4xl font-bold tracking-tight leading-tight"
                            style={{ color: theme.colors.charcoal }}
                        >
                            Start your
                            <br />
                            story here.
                        </h2>
                    </motion.div>

                    <Formik
                        initialValues={{ email: "", password: "" }}
                        validationSchema={schema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => {
                            return (
                                <Form className="space-y-5">
                                    {/* Email */}
                                    <motion.div {...fadeUp(0.25)}>
                                        <InputField
                                            icon={<Mail size={15} />}
                                            name="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            label="Email"
                                        />
                                    </motion.div>

                                    {/* Password */}
                                    <motion.div {...fadeUp(0.3)}>
                                        <InputField
                                            icon={<Lock size={15} />}
                                            name="password"
                                            type="password"
                                            placeholder="Min. 6 characters"
                                            label="Password"
                                        />
                                    </motion.div>

                                    {/* Submit */}
                                    <motion.div {...fadeUp(0.35)} className="pt-2">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            loading={isSubmitting}
                                        >
                                            Login your account
                                        </Button>
                                    </motion.div>

                                    {/* Divider */}
                                    <motion.div {...fadeUp(0.4)} className="flex items-center gap-4 py-2">
                                        <div className="flex-1 h-px" style={{ background: theme.colors.charcoal, opacity: 0.12 }} />
                                        <span
                                            className="text-xs"
                                            style={{
                                                color: theme.colors.charcoal,
                                                opacity: 0.35,
                                                fontFamily: theme.font.body,
                                            }}
                                        >
                                            OR
                                        </span>
                                        <div className="flex-1 h-px" style={{ background: theme.colors.charcoal, opacity: 0.12 }} />
                                    </motion.div>

                                    {/* Sign in link */}
                                    <motion.p
                                        {...fadeUp(0.45)}
                                        className="text-center text-sm"
                                        style={{
                                            color: theme.colors.charcoal,
                                            opacity: 0.5,
                                            fontFamily: theme.font.body,
                                        }}
                                    >
                                        Don&apos;t have an account?{" "}
                                        <Link
                                            href="/SignUp"
                                            className="font-semibold cursor-pointer transition-opacity hover:opacity-100"
                                            style={{ color: theme.colors.charcoal, opacity: 1, textDecoration: "underline" }}
                                        >
                                            Sign Up
                                        </Link>
                                    </motion.p>
                                </Form>
                            )
                        }}
                    </Formik>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
