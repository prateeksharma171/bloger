"use client";

import { createContext, useContext, useState } from "react";
import { AnimatePresence } from "framer-motion";
import ToastComponent from "../components/common/ToastComponent";

type ToastType = "success" | "error" | "info" | "loading";
const MAX_VISIBLE_TOASTS = 3;
const DEFAULT_TOAST_DURATION = 3000;

interface ToastItem {
    id: string;
    type: ToastType;
    title?: string;
    message?: string;
    duration?: number;
}

type ToastContextType = {
    Toast: (toast: Omit<ToastItem, "id">) => string;
    removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }

    return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const Toast = (toast: Omit<ToastItem, "id">) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const nextToast: ToastItem = {
            ...toast,
            id,
            duration: toast.duration ?? DEFAULT_TOAST_DURATION,
        };

        setToasts((prev) => [...prev, nextToast].slice(-MAX_VISIBLE_TOASTS));

        return id;
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ Toast, removeToast }}>
            {children}

            <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex w-[min(92vw,24rem)] flex-col gap-3">
                <AnimatePresence initial={false}>
                    {toasts.map((toast) => (
                        <ToastComponent
                            key={toast.id}
                            {...toast}
                            onClose={() => removeToast(toast.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
