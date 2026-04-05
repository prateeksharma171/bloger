"use client";

import { useField } from "formik";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Alignment } from "@ckeditor/ckeditor5-alignment";
import { Autoformat } from "@ckeditor/ckeditor5-autoformat";
import {
    Bold,
    Code,
    Italic,
    Strikethrough,
    Subscript,
    Superscript,
    Underline,
} from "@ckeditor/ckeditor5-basic-styles";
import { BlockQuote } from "@ckeditor/ckeditor5-block-quote";
import { CodeBlock } from "@ckeditor/ckeditor5-code-block";
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";
import { Essentials } from "@ckeditor/ckeditor5-essentials";
import {
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
} from "@ckeditor/ckeditor5-font";
import { Heading } from "@ckeditor/ckeditor5-heading";
import { GeneralHtmlSupport } from "@ckeditor/ckeditor5-html-support";
import { HorizontalLine } from "@ckeditor/ckeditor5-horizontal-line";
import { Indent } from "@ckeditor/ckeditor5-indent";
import { Link } from "@ckeditor/ckeditor5-link";
import { List, ListProperties, TodoList } from "@ckeditor/ckeditor5-list";
import { MediaEmbed } from "@ckeditor/ckeditor5-media-embed";
import { Paragraph } from "@ckeditor/ckeditor5-paragraph";
import { PasteFromOffice } from "@ckeditor/ckeditor5-paste-from-office";
import { RemoveFormat } from "@ckeditor/ckeditor5-remove-format";
import { SourceEditing } from "@ckeditor/ckeditor5-source-editing";
import {
    SpecialCharacters,
    SpecialCharactersArrows,
    SpecialCharactersCurrency,
    SpecialCharactersEssentials,
    SpecialCharactersLatin,
} from "@ckeditor/ckeditor5-special-characters";
import {
    Table,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
} from "@ckeditor/ckeditor5-table";
import { Undo } from "@ckeditor/ckeditor5-undo";
import { useTheme } from "@/app/theme/ThemeProvider";

type BlogContentEditorProps = {
    name: string;
    label: string;
};

const looksLikeHtml = (value: string) => /<([a-z][^/\s>]*)[\s\S]*?>|<\/([a-z][^/\s>]*)>/i.test(value);

const BlogContentEditor = ({ name, label }: BlogContentEditorProps) => {
    const theme = useTheme();
    const [field, meta, helpers] = useField<string>(name);

    return (
        <div className="space-y-2">
            <label
                className="block text-xs uppercase tracking-[0.24em]"
                style={{ color: `${theme.colors.charcoal}80`, fontFamily: theme.font.body }}
            >
                {label}
            </label>
            <div
                className="blog-editor-shell rounded-3xl border"
                style={{
                    borderColor: meta.touched && meta.error ? "#B74545" : theme.colors.lightGray,
                    background: theme.colors.white,
                    ["--editor-surface" as string]: theme.colors.white,
                    ["--editor-muted-surface" as string]: `${theme.colors.beige}`,
                    ["--editor-border" as string]: theme.colors.lightGray,
                    ["--editor-text" as string]: theme.colors.charcoal,
                    ["--editor-text-muted" as string]: `${theme.colors.charcoal}99`,
                    ["--editor-accent" as string]: theme.colors.amber,
                }}
            >
                <CKEditor
                    editor={ClassicEditor}
                    data={field.value}
                    config={{
                        licenseKey: "GPL",
                        plugins: [
                            Alignment,
                            Autoformat,
                            BlockQuote,
                            Bold,
                            Code,
                            CodeBlock,
                            Essentials,
                            FontBackgroundColor,
                            FontColor,
                            FontFamily,
                            FontSize,
                            GeneralHtmlSupport,
                            Heading,
                            HorizontalLine,
                            Indent,
                            Italic,
                            Link,
                            List,
                            ListProperties,
                            MediaEmbed,
                            Paragraph,
                            PasteFromOffice,
                            RemoveFormat,
                            SourceEditing,
                            SpecialCharacters,
                            SpecialCharactersArrows,
                            SpecialCharactersCurrency,
                            SpecialCharactersEssentials,
                            SpecialCharactersLatin,
                            Strikethrough,
                            Subscript,
                            Superscript,
                            Table,
                            TableCellProperties,
                            TableColumnResize,
                            TableProperties,
                            TableToolbar,
                            TodoList,
                            Underline,
                            Undo,
                        ],
                        toolbar: {
                            items: [
                                "undo",
                                "redo",
                                "|",
                                "heading",
                                "|",
                                "fontSize",
                                "fontFamily",
                                "fontColor",
                                "fontBackgroundColor",
                                "|",
                                "bold",
                                "italic",
                                "underline",
                                "strikethrough",
                                "subscript",
                                "superscript",
                                "code",
                                "removeFormat",
                                "|",
                                "alignment",
                                "|",
                                "link",
                                "insertTable",
                                "blockQuote",
                                "codeBlock",
                                "horizontalLine",
                                "sourceEditing",
                                "specialCharacters",
                                "mediaEmbed",
                                "|",
                                "bulletedList",
                                "numberedList",
                                "todoList",
                                "outdent",
                                "indent",
                            ],
                            shouldNotGroupWhenFull: true,
                        },
                        heading: {
                            options: [
                                { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
                                { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
                                { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
                                { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
                                { model: "heading4", view: "h4", title: "Heading 4", class: "ck-heading_heading4" },
                            ],
                        },
                        fontFamily: {
                            options: [
                                "default",
                                "Arial, Helvetica, sans-serif",
                                "Georgia, serif",
                                "Tahoma, Geneva, sans-serif",
                                "Times New Roman, Times, serif",
                                "Trebuchet MS, Helvetica, sans-serif",
                                "Verdana, Geneva, sans-serif",
                            ],
                            supportAllValues: true,
                        },
                        fontSize: {
                            options: [10, 12, 14, "default", 18, 20, 24, 28, 32],
                            supportAllValues: true,
                        },
                        link: {
                            addTargetToExternalLinks: true,
                            defaultProtocol: "https://",
                        },
                        list: {
                            properties: {
                                styles: true,
                                startIndex: true,
                                reversed: true,
                            },
                        },
                        htmlSupport: {
                            allow: [
                                {
                                    name: /.*/,
                                    attributes: true,
                                    classes: true,
                                    styles: true,
                                },
                            ],
                        },
                        table: {
                            contentToolbar: [
                                "tableColumn",
                                "tableRow",
                                "mergeTableCells",
                                "tableProperties",
                                "tableCellProperties",
                            ],
                        },
                        placeholder: "Write your blog body here...",
                    }}
                    onReady={(editor) => {
                        const editableElement = editor.ui.getEditableElement();

                        if (!editableElement) {
                            return;
                        }

                        editableElement.addEventListener("paste", (event: ClipboardEvent) => {
                            const sourceEditing = editor.plugins.get("SourceEditing") as {
                                isSourceEditingMode?: boolean;
                            };

                            if (sourceEditing?.isSourceEditingMode) {
                                return;
                            }

                            const clipboard = event.clipboardData;
                            const plainText = clipboard?.getData("text/plain")?.trim() ?? "";
                            const htmlText = clipboard?.getData("text/html")?.trim() ?? "";
                            const contentToInsert = htmlText || (looksLikeHtml(plainText) ? plainText : "");

                            if (!contentToInsert) {
                                return;
                            }

                            event.preventDefault();

                            const viewFragment = editor.data.processor.toView(contentToInsert);
                            const modelFragment = editor.data.toModel(viewFragment);

                            editor.model.change(() => {
                                editor.model.insertContent(modelFragment, editor.model.document.selection);
                            });
                        });
                    }}
                    onChange={(_, editor) => {
                        helpers.setValue(editor.getData());
                    }}
                    onBlur={() => helpers.setTouched(true)}
                />
            </div>
            {meta.touched && meta.error ? (
                <p className="text-xs" style={{ color: "#B74545", fontFamily: theme.font.body }}>
                    {meta.error}
                </p>
            ) : null}
        </div>
    );
};

export default BlogContentEditor;
