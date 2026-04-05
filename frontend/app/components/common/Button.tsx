"use client";

import { useTheme } from "@/app/theme/ThemeProvider";
import { HTMLMotionProps, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import React from "react";

interface ButtonProps extends HTMLMotionProps<"button"> {
    loading?: boolean;
    children: React.ReactNode;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

const Button = ({
    loading = false,
    children,
    icon,
    fullWidth = true,
    disabled,
    className = "",
    ...props
}: ButtonProps) => {
    const isDisabled = disabled || loading;
    const theme = useTheme()

    return (
        <motion.button
            whileTap={{ scale: 1 }}
            disabled={isDisabled}
            className={`
        group flex items-center justify-between px-6 py-4
        font-medium text-sm tracking-wide transition-all duration-300 cursor-pointer
        ${fullWidth ? "w-full" : ""}
        ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
            style={{
                background: theme.colors.charcoal,
                color: theme.colors.beige,
                fontFamily: theme.font.body,
                letterSpacing: "0.08em",
            }}
            {...props}
        >
            {/* TEXT */}
            <span className="uppercase flex items-center gap-2">
                {loading ? "Loading..." : children}
            </span>

            {/* ICON / LOADER */}
            {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
                icon || (
                    <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={16} />
                )
            )}
        </motion.button>
    );
};

export default Button;