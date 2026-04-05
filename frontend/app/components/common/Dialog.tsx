"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useTheme } from "@/app/theme/ThemeProvider";

type DialogProps = {
    open: boolean;
    title: string;
    description?: string;
    children?: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    onClose: () => void;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
    loading?: boolean;
    destructive?: boolean;
    confirmDisabled?: boolean;
    cancelDisabled?: boolean;
    closeOnOverlayClick?: boolean;
    showCloseButton?: boolean;
    hideFooter?: boolean;
    confirmIcon?: ReactNode;
};

const Dialog = ({
    open,
    title,
    description,
    children,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onClose,
    onConfirm,
    onCancel,
    loading = false,
    destructive = false,
    confirmDisabled = false,
    cancelDisabled = false,
    closeOnOverlayClick = true,
    showCloseButton = true,
    hideFooter = false,
    confirmIcon,
}: DialogProps) => {
    const theme = useTheme();
    const isConfirmDisabled = confirmDisabled || loading;
    const isCancelDisabled = cancelDisabled || loading;

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !loading) {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [loading, onClose, open]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [open]);

    return (
        <AnimatePresence>
            {open ? (
                <motion.div
                    className="fixed inset-0 z-[70] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <button
                        type="button"
                        aria-label="Close dialog overlay"
                        className="absolute inset-0 cursor-default"
                        style={{ background: "rgba(28, 28, 26, 0.45)" }}
                        onClick={() => {
                            if (closeOnOverlayClick && !loading) {
                                onClose();
                            }
                        }}
                    />

                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="dialog-title"
                        aria-describedby={description ? "dialog-description" : undefined}
                        initial={{ opacity: 0, y: 18, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="relative z-[71] w-full max-w-xl overflow-hidden rounded-[2rem] border"
                        style={{
                            background: theme.colors.white,
                            borderColor: theme.colors.lightGray,
                            boxShadow: "0 24px 80px rgba(28,28,26,0.18)",
                        }}
                    >
                        <div className="flex items-start justify-between gap-4 border-b px-6 py-5 md:px-8" style={{ borderColor: theme.colors.lightGray }}>
                            <div className="space-y-2">
                                <h2
                                    id="dialog-title"
                                    className="text-2xl md:text-3xl"
                                    style={{ color: theme.colors.charcoal, fontFamily: theme.font.heading }}
                                >
                                    {title}
                                </h2>
                                {description ? (
                                    <p
                                        id="dialog-description"
                                        className="max-w-lg text-sm leading-7"
                                        style={{ color: `${theme.colors.charcoal}99`, fontFamily: theme.font.body }}
                                    >
                                        {description}
                                    </p>
                                ) : null}
                            </div>

                            {showCloseButton ? (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                                    style={{
                                        borderColor: theme.colors.lightGray,
                                        color: theme.colors.charcoal,
                                        background: theme.colors.beige,
                                    }}
                                    aria-label="Close dialog"
                                >
                                    <X size={18} />
                                </button>
                            ) : null}
                        </div>

                        {children ? (
                            <div className="px-6 py-5 md:px-8">
                                {children}
                            </div>
                        ) : null}

                        {!hideFooter ? (
                            <div
                                className="flex flex-col gap-3 border-t px-6 py-5 sm:flex-row sm:justify-end md:px-8"
                                style={{ borderColor: theme.colors.lightGray, background: `${theme.colors.beige}80` }}
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        onCancel?.();
                                        onClose();
                                    }}
                                    disabled={isCancelDisabled}
                                    className="inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
                                    style={{
                                        borderColor: theme.colors.lightGray,
                                        color: theme.colors.charcoal,
                                        background: theme.colors.white,
                                        fontFamily: theme.font.body,
                                    }}
                                >
                                    {cancelLabel}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        void onConfirm?.();
                                    }}
                                    disabled={isConfirmDisabled}
                                    className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                                    style={{
                                        background: destructive ? "#B74545" : theme.colors.charcoal,
                                        color: theme.colors.beige,
                                        fontFamily: theme.font.body,
                                    }}
                                >
                                    {loading ? (
                                        <span className="inline-flex items-center gap-2">
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            Processing...
                                        </span>
                                    ) : (
                                        <>
                                            {confirmIcon}
                                            <span>{confirmLabel}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : null}
                    </motion.div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
};

export default Dialog;
