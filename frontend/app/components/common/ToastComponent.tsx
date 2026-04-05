"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, Loader2, X } from "lucide-react";
import { useEffect } from "react";
import { useTheme } from "@/app/theme/ThemeProvider";

type ToastType = "success" | "error" | "info" | "loading";

interface ToastProps {
    id?: string;
    type?: ToastType;
    title?: string;
    message?: string;
    duration?: number; // ms
    onClose?: () => void;
}

const icons = {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
    loading: Loader2,
};

const toneStyles: Record<
    ToastType,
    {
        accent: string;
        iconBackground: string;
        iconColor: string;
        progressBackground: string;
        progressFill: string;
    }
> = {
    success: {
        accent: "#2F7A4D",
        iconBackground: "rgba(47, 122, 77, 0.12)",
        iconColor: "#2F7A4D",
        progressBackground: "rgba(47, 122, 77, 0.12)",
        progressFill: "#2F7A4D",
    },
    error: {
        accent: "#B74545",
        iconBackground: "rgba(183, 69, 69, 0.12)",
        iconColor: "#B74545",
        progressBackground: "rgba(183, 69, 69, 0.12)",
        progressFill: "#B74545",
    },
    info: {
        accent: "#2C5E87",
        iconBackground: "rgba(44, 94, 135, 0.12)",
        iconColor: "#2C5E87",
        progressBackground: "rgba(44, 94, 135, 0.12)",
        progressFill: "#2C5E87",
    },
    loading: {
        accent: "#D4A853",
        iconBackground: "rgba(212, 168, 83, 0.16)",
        iconColor: "#8D6520",
        progressBackground: "rgba(212, 168, 83, 0.16)",
        progressFill: "#D4A853",
    },
};

const ToastComponent = ({
    type = "info",
    title,
    message,
    duration = 3000,
    onClose,
}: ToastProps) => {
    const theme = useTheme();
    const Icon = icons[type];
    const tone = toneStyles[type];
    const displayTitle =
        title ??
        (type === "success"
            ? "Success"
            : type === "error"
              ? "Something went wrong"
              : type === "loading"
                ? "Working on it"
                : "Heads up");

    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose?.();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{
                duration: 0.28,
                ease: [0.22, 1, 0.36, 1],
            }}
            className="pointer-events-auto relative overflow-hidden rounded-[22px] border p-4 shadow-[0_18px_60px_rgba(28,28,26,0.16)] backdrop-blur-sm"
            style={{
                background: "rgba(245, 240, 232, 0.94)",
                borderColor: `${theme.colors.charcoal}1A`,
                fontFamily: theme.font.body,
            }}
        >
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage:
                        'radial-gradient(circle at top right, rgba(212,168,83,0.14), transparent 34%), radial-gradient(circle at bottom left, rgba(28,28,26,0.06), transparent 32%)',
                }}
            />

            <div
                className="absolute left-0 top-0 h-full w-1"
                style={{ background: tone.accent }}
            />

            <div className="flex items-start gap-3">
                <div
                    className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                    style={{
                        background: tone.iconBackground,
                        color: tone.iconColor,
                    }}
                >
                    <Icon
                        size={19}
                        className={type === "loading" ? "animate-spin" : ""}
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p
                                className="text-sm font-semibold tracking-[0.01em]"
                                style={{ color: theme.colors.charcoal }}
                            >
                                {displayTitle}
                            </p>
                            {message ? (
                                <p
                                    className="mt-1 text-sm leading-5"
                                    style={{ color: `${theme.colors.charcoal}B3` }}
                                >
                                    {message}
                                </p>
                            ) : null}
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full p-1 transition hover:bg-black/5"
                            aria-label="Close toast"
                            style={{ color: `${theme.colors.charcoal}99` }}
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div
                        className="mt-3 h-1.5 overflow-hidden rounded-full"
                        style={{ background: tone.progressBackground }}
                    >
                        {type === "loading" ? (
                            <motion.div
                                className="h-full rounded-full"
                                style={{ background: tone.progressFill, width: "35%" }}
                                animate={{ x: ["-120%", "320%"] }}
                                transition={{
                                    duration: 1.2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "easeInOut",
                                }}
                            />
                        ) : (
                            <motion.div
                                className="h-full origin-left rounded-full"
                                style={{ background: tone.progressFill }}
                                initial={{ scaleX: 1 }}
                                animate={{ scaleX: 0 }}
                                transition={{ duration: duration / 1000, ease: "linear" }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ToastComponent;
