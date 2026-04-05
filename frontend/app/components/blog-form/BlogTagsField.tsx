"use client";

import { useField } from "formik";
import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { useTheme } from "@/app/theme/ThemeProvider";

const normalizeTags = (value: string) =>
    Array.from(
        new Set(
            value
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
        ),
    );

type BlogTagsFieldProps = {
    name: string;
    label: string;
    placeholder: string;
};

const BlogTagsField = ({ name, label, placeholder }: BlogTagsFieldProps) => {
    const theme = useTheme();
    const [field, meta, helpers] = useField<string>(name);
    const [draftTag, setDraftTag] = useState("");
    const previewTags = useMemo(() => normalizeTags(field.value), [field.value]);

    const syncTags = (tags: string[]) => {
        helpers.setValue(tags.join(", "));
        helpers.setTouched(true);
    };

    const commitDraftTag = () => {
        const trimmedDraft = draftTag.trim();
        if (!trimmedDraft) {
            return;
        }

        syncTags([...previewTags, trimmedDraft]);
        setDraftTag("");
    };

    const removeTag = (tagToRemove: string) => {
        syncTags(previewTags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div className="space-y-3">
            <label
                htmlFor={name}
                className="block text-xs uppercase tracking-[0.24em]"
                style={{ color: `${theme.colors.charcoal}80`, fontFamily: theme.font.body }}
            >
                {label}
            </label>
            <div
                className="flex min-h-28 w-full flex-wrap items-start gap-2 rounded-2xl border px-3 py-3 transition"
                style={{
                    borderColor: meta.touched && meta.error ? "#B74545" : theme.colors.lightGray,
                    background: theme.colors.white,
                }}
                onClick={(event) => {
                    const input = event.currentTarget.querySelector("input");
                    input?.focus();
                }}
            >
                {previewTags.length > 0 ? (
                    previewTags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs shadow-sm"
                            style={{
                                background: `${theme.colors.charcoal}0D`,
                                color: theme.colors.charcoal,
                                fontFamily: theme.font.body,
                            }}
                        >
                            <span>{tag}</span>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    removeTag(tag);
                                }}
                                className="inline-flex h-5 w-5 items-center justify-center rounded-full transition"
                                style={{
                                    background: `${theme.colors.charcoal}14`,
                                    color: `${theme.colors.charcoal}B3`,
                                }}
                                aria-label={`Remove ${tag} tag`}
                            >
                                <X size={12} />
                            </button>
                        </span>
                    ))
                ) : null}

                <input
                    id={name}
                    type="text"
                    value={draftTag}
                    onBlur={() => {
                        commitDraftTag();
                        helpers.setTouched(true);
                    }}
                    onChange={(event) => {
                        const nextValue = event.target.value;

                        if (nextValue.includes(",")) {
                            const parts = nextValue.split(",");
                            const completeTags = parts.slice(0, -1).map((tag) => tag.trim()).filter(Boolean);
                            const lastPart = parts[parts.length - 1] ?? "";

                            if (completeTags.length > 0) {
                                syncTags([...previewTags, ...completeTags]);
                            }

                            setDraftTag(lastPart);
                            return;
                        }

                        setDraftTag(nextValue);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            commitDraftTag();
                            return;
                        }

                        if (event.key === "Backspace" && !draftTag && previewTags.length > 0) {
                            event.preventDefault();
                            syncTags(previewTags.slice(0, -1));
                        }
                    }}
                    placeholder={previewTags.length === 0 ? placeholder : "Add another tag"}
                    className="min-w-[10rem] flex-1 bg-transparent px-2 py-2 text-sm outline-none"
                    style={{
                        color: theme.colors.charcoal,
                        fontFamily: theme.font.body,
                    }}
                />
            </div>
            <p className="text-xs" style={{ color: `${theme.colors.charcoal}66`, fontFamily: theme.font.body }}>
                Spaces are allowed inside a tag. Press Enter or type a comma to create a chip. Use Backspace on an empty input to remove the last one.
            </p>
            {meta.touched && meta.error ? (
                <p className="text-xs" style={{ color: "#B74545", fontFamily: theme.font.body }}>
                    {meta.error}
                </p>
            ) : null}
        </div>
    );
};

export default BlogTagsField;
export { normalizeTags };
