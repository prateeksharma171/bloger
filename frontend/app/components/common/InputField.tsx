import { useField } from "formik";
import { useTheme } from "@/app/theme/ThemeProvider";

const InputField = ({
    icon,
    name,
    type,
    placeholder,
    label,
}: {
    icon: React.ReactNode;
    name: string;
    type: string;
    placeholder: string;
    label: string;
}) => {
    const theme = useTheme();
    const [field, meta] = useField(name);

    return (
        <div>
            <label
                htmlFor={name}
                className="block text-xs mb-2 uppercase tracking-widest"
                style={{
                    color: theme.colors.charcoal,
                    opacity: 0.4,
                    fontFamily: theme.font.body,
                    fontWeight: 500,
                }}
            >
                {label}
            </label>

            <div className="relative">
                <div
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: theme.colors.charcoal, opacity: 0.3 }}
                >
                    {icon}
                </div>

                <input
                    {...field}
                    id={name}
                    type={type}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-3.5 text-sm outline-none transition-all duration-200 border-b-2"
                    style={{
                        background: "transparent",
                        borderBottom: "2px solid",
                        borderColor:
                            meta.touched && meta.error
                                ? "red"
                                : theme.colors.lightGray,
                        color: theme.colors.charcoal,
                        fontFamily: theme.font.body,
                    }}
                />
            </div>

            {meta.touched && meta.error && (
                <p
                    className="text-xs mt-1"
                    style={{ color: "red", fontFamily: theme.font.body }}
                >
                    {meta.error}
                </p>
            )}
        </div>
    );
};

export default InputField;