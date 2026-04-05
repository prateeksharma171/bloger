"use client";

import { useField } from "formik";
import { useTheme } from "@/app/theme/ThemeProvider";

type BlogTextFieldProps = {
    name: string;
    label: string;
    placeholder: string;
    type?: string;
};

const BlogTextField = ({
    name,
    label,
    placeholder,
    type = "text",
}: BlogTextFieldProps) => {
    const theme = useTheme();
    const [field, meta] = useField(name);

    return (
        <div className="space-y-2">
            <label
                htmlFor={name}
                className="block text-xs uppercase tracking-[0.24em]"
                style={{ color: `${theme.colors.charcoal}80`, fontFamily: theme.font.body }}
            >
                {label}
            </label>
            <input
                {...field}
                id={name}
                type={type}
                placeholder={placeholder}
                className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition"
                style={{
                    borderColor: meta.touched && meta.error ? "#B74545" : theme.colors.lightGray,
                    color: theme.colors.charcoal,
                    background: theme.colors.white,
                    fontFamily: theme.font.body,
                }}
            />
            {meta.touched && meta.error ? (
                <p className="text-xs" style={{ color: "#B74545", fontFamily: theme.font.body }}>
                    {meta.error}
                </p>
            ) : null}
        </div>
    );
};

export default BlogTextField;
