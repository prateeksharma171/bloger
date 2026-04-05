"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useTheme } from "@/app/theme/ThemeProvider";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
    itemsPerPage?: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
    showEdgeButtons?: boolean;
    showPageInfo?: boolean;
    showItemsInfo?: boolean;
    disabled?: boolean;
}

function usePagination(currentPage: number, totalPages: number, siblingCount = 1) {
    const range = (start: number, end: number) =>
        Array.from({ length: end - start + 1 }, (_, i) => start + i);

    const totalNumbers = siblingCount * 2 + 5;

    if (totalPages <= totalNumbers) return range(1, totalPages);

    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPages - 1;

    if (!showLeftDots && showRightDots) {
        const leftRange = range(1, 3 + siblingCount * 2);
        return [...leftRange, "...", totalPages];
    }

    if (showLeftDots && !showRightDots) {
        const rightRange = range(totalPages - (2 + siblingCount * 2), totalPages);
        return [1, "...", ...rightRange];
    }

    return [1, "...", ...range(leftSibling, rightSibling), "...", totalPages];
}

const NavButton = ({
    onClick,
    disabled,
    children,
    label,
    theme,
}: {
    onClick: () => void;
    disabled: boolean;
    children: React.ReactNode;
    label: string;
    theme: ReturnType<typeof useTheme>;
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            className="w-8 h-8 rounded-sm flex items-center justify-center border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
                borderColor: `${theme.colors.charcoal}26`,
                color: `${theme.colors.charcoal}80`,
                background: "transparent",
            }}
        >
            {children}
        </button>
    );
};

const Pagination = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    siblingCount = 1,
    showEdgeButtons = true,
    showPageInfo = true,
    showItemsInfo = false,
    disabled = false,
}: PaginationProps) => {
    const theme = useTheme();
    const pages = usePagination(currentPage, totalPages, siblingCount);

    if (totalPages <= 1) return null;

    const goTo = (page: number) => {
        if (disabled || page < 1 || page > totalPages || page === currentPage) return;
        onPageChange(page);
    };

    const itemsLabel = (() => {
        if (!showItemsInfo || !totalItems || !itemsPerPage) return null;
        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, totalItems);
        return `${start}–${end} of ${totalItems}`;
    })();

    return (
        <div
            className="flex flex-col items-center gap-3 select-none"
            style={{ fontFamily: theme.font.body }}
        >

            {/* Info row */}
            {(showPageInfo || itemsLabel) && (
                <div
                    className="flex items-center gap-4 text-[11px] tracking-wide"
                    style={{ color: `${theme.colors.charcoal}66` }}
                >
                    {showPageInfo && (
                        <span>
                            Page <span className="font-semibold" style={{ color: `${theme.colors.charcoal}B3` }}>{currentPage}</span> of{" "}
                            <span className="font-semibold" style={{ color: `${theme.colors.charcoal}B3` }}>{totalPages}</span>
                        </span>
                    )}
                    {showPageInfo && itemsLabel && (
                        <span className="w-px h-3" style={{ background: `${theme.colors.charcoal}33` }} />
                    )}
                    {itemsLabel && <span>{itemsLabel}</span>}
                </div>
            )}

            {/* Controls row */}
            <div className={`flex items-center gap-1 ${disabled ? "pointer-events-none opacity-50" : ""}`}>

                {/* First page */}
                {showEdgeButtons && (
                    <NavButton onClick={() => goTo(1)} disabled={currentPage === 1} label="First page" theme={theme}>
                        <ChevronsLeft size={14} strokeWidth={2} />
                    </NavButton>
                )}

                {/* Prev */}
                <NavButton onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1} label="Previous page" theme={theme}>
                    <ChevronLeft size={14} strokeWidth={2} />
                </NavButton>

                {/* Page numbers */}
                <div className="flex items-center gap-1 mx-1">
                    {pages.map((page, idx) =>
                        page === "..." ? (
                            <span
                                key={`dots-${idx}`}
                                className="w-8 h-8 flex items-center justify-center text-[12px]"
                                style={{ color: `${theme.colors.charcoal}30` }}
                            >
                                ···
                            </span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => goTo(page as number)}
                                aria-label={`Page ${page}`}
                                aria-current={currentPage === page ? "page" : undefined}
                                className={`w-8 h-8 rounded-sm text-[12px] font-medium transition-all duration-200 ${currentPage === page
                                    ? `bg-[${theme.colors.charcoal}] text-[${theme.colors.beige}] border border-[${theme.colors.charcoal}]`
                                    : `border border-[${theme.colors.charcoal}/15] text-[${theme.colors.charcoal}/60] hover:border-[${theme.colors.amber}] hover:text-[${theme.colors.amber}] hover:bg-[${theme.colors.amber}/5]`
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    )}
                </div>

                <NavButton onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages} label="Next page" theme={theme}>
                    <ChevronRight size={14} strokeWidth={2} />
                </NavButton>

                {showEdgeButtons && (
                    <NavButton onClick={() => goTo(totalPages)} disabled={currentPage === totalPages} label="Last page" theme={theme}>
                        <ChevronsRight size={14} strokeWidth={2} />
                    </NavButton>
                )}
            </div>

            <div className="flex gap-1">
                {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                    const segment = Math.ceil((currentPage / totalPages) * Math.min(totalPages, 7));
                    return (
                        <div
                            key={i}
                            className={`h-0.5 w-4 rounded-full transition-all duration-300 ${i + 1 === segment ? theme.colors.amber : theme.colors.charcoal
                                }`}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Pagination;
