"use client";

import { useField } from "formik";
import { useTheme } from "@/app/theme/ThemeProvider";

type BlogTextareaFieldProps = {
    name: string;
    label: string;
    placeholder: string;
    rows?: number;
};

const BlogTextareaField = ({
    name,
    label,
    placeholder,
    rows = 4,
}: BlogTextareaFieldProps) => {
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
            <textarea
                {...field}
                id={name}
                rows={rows}
                placeholder={placeholder}
                className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition resize-y"
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

export default BlogTextareaField;
