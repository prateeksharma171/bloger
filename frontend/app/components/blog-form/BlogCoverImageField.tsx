"use client";

import { useRef, useState } from "react";
import { useField } from "formik";
import Image from "next/image";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";
import { useTheme } from "@/app/theme/ThemeProvider";

type BlogCoverImageFieldProps = {
    name: string;
    label: string;
    onUpload: (file: File) => Promise<string>;
};

const BlogCoverImageField = ({
    name,
    label,
    onUpload,
}: BlogCoverImageFieldProps) => {
    const theme = useTheme();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [field, meta, helpers] = useField<string>(name);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const url = await onUpload(file);
            helpers.setValue(url);
            helpers.setTouched(true);
        } finally {
            setUploading(false);
            event.target.value = "";
        }
    };

    return (
        <div className="space-y-3">
            <label
                className="block text-xs uppercase tracking-[0.24em]"
                style={{ color: `${theme.colors.charcoal}80`, fontFamily: theme.font.body }}
            >
                {label}
            </label>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                    void handleFileChange(event);
                }}
            />

            <div
                className="overflow-hidden rounded-[1.5rem] border"
                style={{
                    borderColor: meta.touched && meta.error ? "#B74545" : theme.colors.lightGray,
                    background: theme.colors.white,
                }}
            >
                {field.value ? (
                    <div className="relative aspect-[16/10] w-full">
                        <Image
                            src={field.value}
                            alt="Cover preview"
                            fill
                            unoptimized
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                            <div>
                                <p
                                    className="text-xs uppercase tracking-[0.22em]"
                                    style={{ color: `${theme.colors.beige}CC`, fontFamily: theme.font.body }}
                                >
                                    Cover ready
                                </p>
                                <p
                                    className="mt-1 text-sm"
                                    style={{ color: theme.colors.beige, fontFamily: theme.font.body }}
                                >
                                    Your selected image is attached to this blog.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => helpers.setValue("")}
                                className="flex h-10 w-10 items-center justify-center rounded-full"
                                style={{ background: "rgba(255,255,255,0.18)", color: theme.colors.beige }}
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="flex w-full flex-col items-center justify-center gap-4 px-6 py-10 text-center"
                    >
                        <div
                            className="flex h-14 w-14 items-center justify-center rounded-full"
                            style={{ background: `${theme.colors.amber}1A`, color: theme.colors.amber }}
                        >
                            <ImagePlus size={24} />
                        </div>
                        <div className="space-y-1">
                            <p
                                className="text-base"
                                style={{ color: theme.colors.charcoal, fontFamily: theme.font.heading }}
                            >
                                Choose cover image from your system
                            </p>
                            <p
                                className="text-sm"
                                style={{ color: `${theme.colors.charcoal}99`, fontFamily: theme.font.body }}
                            >
                                Upload a JPG, PNG, or WebP image up to 2MB.
                            </p>
                        </div>
                    </button>
                )}

                <div className="flex items-center justify-between border-t px-4 py-3" style={{ borderColor: theme.colors.lightGray }}>
                    <div className="flex items-center gap-2">
                        {uploading ? (
                            <Loader2 size={16} className="animate-spin" style={{ color: theme.colors.amber }} />
                        ) : (
                            <Upload size={16} style={{ color: theme.colors.amber }} />
                        )}
                        <p
                            className="text-sm"
                            style={{ color: `${theme.colors.charcoal}99`, fontFamily: theme.font.body }}
                        >
                            {uploading
                                ? "Uploading cover image..."
                                : field.value
                                    ? "You can replace the selected image any time."
                                    : "No image selected yet."}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="rounded-full px-4 py-2 text-sm"
                        style={{
                            background: `${theme.colors.charcoal}0D`,
                            color: theme.colors.charcoal,
                            fontFamily: theme.font.body,
                        }}
                    >
                        {field.value ? "Replace" : "Browse"}
                    </button>
                </div>
            </div>

            {meta.touched && meta.error ? (
                <p className="text-xs" style={{ color: "#B74545", fontFamily: theme.font.body }}>
                    {meta.error}
                </p>
            ) : null}
        </div>
    );
};

export default BlogCoverImageField;
