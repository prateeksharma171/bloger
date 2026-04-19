"use client"

import { useEffect, useMemo, useState, startTransition } from "react"
import Link from "next/link"
import { Search, SlidersHorizontal } from "lucide-react"
import { getAllBlogs } from "./api/blogs"
import { isRequestCanceled } from "./api/axiosInstance"
import BlogCard, { Blog } from "./components/common/BlogCard"
import Footer from "./components/common/Footer"
import Main from "./components/common/Main"
import Navbar from "./components/common/Navbar"
import Pagination from "./components/common/Pagination"
import { useAuth } from "./context/authContext"
import { useTheme } from "./theme/ThemeProvider"

const BLOGS_PER_PAGE = 20;

const LandingPage = () => {
  const theme = useTheme();
  const { isAuthenticated, user, loading } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [search]);

  useEffect(() => {
    if (loading || !isAuthenticated) {
      setBlogs([]);
      setAllTags([]);
      setTotalBlogs(0);
      setTotalPages(1);
      setIsLoadingBlogs(false);
      return;
    }

    const loadTags = async () => {
      try {
        const response = await getAllBlogs({ limit: 100 });
        const fetchedBlogs = (response.data?.blogs ?? []) as Blog[];
        const uniqueTags = Array.from(
          new Set(
            fetchedBlogs.flatMap((blog) =>
              (blog.tags ?? []).map((tag) => tag.trim()).filter(Boolean),
            ),
          ),
        );

        setAllTags(uniqueTags);
      } catch {
        setAllTags([]);
      }
    };

    void loadTags();
  }, [isAuthenticated, loading]);

  const tags = useMemo(() => {
    return ["All", ...allTags];
  }, [allTags]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTag, debouncedSearch]);

  useEffect(() => {
    if (loading || !isAuthenticated) {
      setBlogs([]);
      setTotalBlogs(0);
      setTotalPages(1);
      setIsLoadingBlogs(false);
      return;
    }

    const controller = new AbortController();

    const loadBlogs = async () => {
      setIsLoadingBlogs(true);
      setError("");

      try {
        const response = await getAllBlogs({
          limit: BLOGS_PER_PAGE,
          page: currentPage,
          search: debouncedSearch || undefined,
          tag: activeTag === "All" ? undefined : activeTag,
          signal: controller.signal,
        });

        setBlogs((response.data?.blogs ?? []) as Blog[]);
        setTotalBlogs(Number(response.data?.pagination?.total ?? 0));
        setTotalPages(Math.max(1, Number(response.data?.pagination?.totalPages ?? 1)));
      } catch (err) {
        if (isRequestCanceled(err)) {
          return;
        }

        const nextError =
          err instanceof Error ? err.message : "We couldn't load blogs right now.";
        setError(nextError);
        setBlogs([]);
        setTotalBlogs(0);
        setTotalPages(1);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingBlogs(false);
        }
      }
    };

    void loadBlogs();

    return () => {
      controller.abort();
    };
  }, [activeTag, currentPage, debouncedSearch, isAuthenticated, loading]);

  return (
    <div className="min-h-screen" style={{ background: theme.colors.beige }}>
      <Navbar />
      <Main>
        <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-10 md:px-10 md:py-14">
          <div
            id="discover-stories"
            className="grid gap-8 overflow-hidden rounded-4xl border px-6 py-8 md:grid-cols-[1.2fr_0.8fr] md:px-10 md:py-12"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.beige} 0%, ${theme.colors.white} 100%)`,
              borderColor: theme.colors.lightGray,
            }}
          >
            <div className="space-y-6">
              <p
                className="text-xs uppercase tracking-[0.35em]"
                style={{ color: theme.colors.amber, fontFamily: theme.font.body }}
              >
                Discover stories that stay with you
              </p>
              <div className="space-y-4">
                <h1
                  className="max-w-3xl text-4xl leading-tight md:text-6xl"
                  style={{ color: theme.colors.charcoal, fontFamily: theme.font.heading }}
                >
                  {loading
                    ? "Loading your reading room..."
                    : isAuthenticated
                      ? `Welcome back, ${user?.name}. Find your next favorite post.`
                      : "A calm, elegant place to explore every blog in one screen."}
                </h1>
                <p
                  className="max-w-2xl text-sm leading-7 md:text-base"
                  style={{ color: `${theme.colors.charcoal}B3`, fontFamily: theme.font.body }}
                >
                  Search across titles, authors, tags, and content, then narrow the feed by category without leaving the homepage.
                </p>
              </div>
              {!isAuthenticated && !loading ? (
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/Login"
                    className="rounded-full px-5 py-3 text-sm transition-opacity hover:opacity-85"
                    style={{
                      background: theme.colors.charcoal,
                      color: theme.colors.beige,
                      fontFamily: theme.font.body,
                    }}
                  >
                    Login to view blogs
                  </Link>
                  <Link
                    href="/SignUp"
                    className="rounded-full border px-5 py-3 text-sm transition-colors hover:bg-white"
                    style={{
                      borderColor: theme.colors.lightGray,
                      color: theme.colors.charcoal,
                      fontFamily: theme.font.body,
                    }}
                  >
                    Create account
                  </Link>
                </div>
              ) : null}
            </div>

            <div
              className="flex flex-col justify-between rounded-3xl border p-6"
              style={{
                background: `${theme.colors.white}B3`,
                borderColor: theme.colors.lightGray,
              }}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full"
                    style={{ background: `${theme.colors.amber}26`, color: theme.colors.amber }}
                  >
                    <SlidersHorizontal size={18} />
                  </div>
                  <div>
                    <p
                      className="text-sm uppercase tracking-[0.2em]"
                      style={{ color: theme.colors.amber, fontFamily: theme.font.body }}
                    >
                      Feed controls
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: `${theme.colors.charcoal}99`, fontFamily: theme.font.body }}
                    >
                      Instant search and category filtering
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: `${theme.colors.charcoal}73` }}
                  />
                  <input
                    value={search}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      startTransition(() => {
                        setSearch(nextValue);
                      });
                    }}
                    placeholder="Search by title, author, tag, or keyword"
                    className="w-full rounded-full border py-3 pl-11 pr-4 text-sm outline-none"
                    style={{
                      borderColor: theme.colors.lightGray,
                      color: theme.colors.charcoal,
                      background: theme.colors.white,
                      fontFamily: theme.font.body,
                    }}
                  />
                </div>
              </div>

              <div className="grid gap-4 pt-8 sm:grid-cols-3">
                <div>
                  <p
                    className="text-[11px] uppercase tracking-[0.22em]"
                    style={{ color: `${theme.colors.charcoal}80`, fontFamily: theme.font.body }}
                  >
                    Total blogs
                  </p>
                  <p
                    className="mt-2 text-3xl"
                    style={{ color: theme.colors.charcoal, fontFamily: theme.font.heading }}
                  >
                    {totalBlogs}
                  </p>
                </div>
                <div>
                  <p
                    className="text-[11px] uppercase tracking-[0.22em]"
                    style={{ color: `${theme.colors.charcoal}80`, fontFamily: theme.font.body }}
                  >
                    Categories
                  </p>
                  <p
                    className="mt-2 text-3xl"
                    style={{ color: theme.colors.charcoal, fontFamily: theme.font.heading }}
                  >
                    {Math.max(tags.length - 1, 0)}
                  </p>
                </div>
                <div>
                  <p
                    className="text-[11px] uppercase tracking-[0.22em]"
                    style={{ color: `${theme.colors.charcoal}80`, fontFamily: theme.font.body }}
                  >
                    Showing now
                  </p>
                  <p
                    className="mt-2 text-3xl"
                    style={{ color: theme.colors.charcoal, fontFamily: theme.font.heading }}
                  >
                    {blogs.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div id="browse-collection" className="space-y-6 scroll-mt-28">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p
                  className="text-xs uppercase tracking-[0.28em]"
                  style={{ color: theme.colors.amber, fontFamily: theme.font.body }}
                >
                  Latest blogs
                </p>
                <h2
                  className="mt-2 text-3xl md:text-4xl"
                  style={{ color: theme.colors.charcoal, fontFamily: theme.font.heading }}
                >
                  Browse the full collection
                </h2>
              </div>
              <p
                className="text-sm"
                style={{ color: `${theme.colors.charcoal}99`, fontFamily: theme.font.body }}
              >
                Choose a tag and refine with search for faster discovery.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => {
                const isActive = tag === activeTag;

                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      startTransition(() => {
                        setActiveTag(tag);
                      });
                    }}
                    className="rounded-full border px-4 py-2 text-sm transition-all"
                    style={{
                      background: isActive ? theme.colors.charcoal : "transparent",
                      color: isActive ? theme.colors.beige : theme.colors.charcoal,
                      borderColor: isActive ? theme.colors.charcoal : theme.colors.lightGray,
                      fontFamily: theme.font.body,
                    }}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>

            {error ? (
              <div
                className="rounded-3xl border px-6 py-12 text-center"
                style={{ background: theme.colors.white, borderColor: `${theme.colors.amber}4D` }}
              >
                <p
                  className="text-lg"
                  style={{ color: theme.colors.charcoal, fontFamily: theme.font.heading }}
                >
                  Unable to load blogs
                </p>
                <p
                  className="mt-3 text-sm"
                  style={{ color: `${theme.colors.charcoal}99`, fontFamily: theme.font.body }}
                >
                  {error}
                </p>
              </div>
            ) : null}

            {!loading && !isAuthenticated ? (
              <div
                className="rounded-3xl border px-6 py-14 text-center"
                style={{ background: theme.colors.white, borderColor: theme.colors.lightGray }}
              >
                <p
                  className="text-2xl"
                  style={{ color: theme.colors.charcoal, fontFamily: theme.font.heading }}
                >
                  Sign in to explore all blogs on the home screen.
                </p>
                <p
                  className="mt-3 text-sm"
                  style={{ color: `${theme.colors.charcoal}99`, fontFamily: theme.font.body }}
                >
                  The blog API requires an authenticated session, so the feed appears as soon as you log in.
                </p>
              </div>
            ) : null}

            {isAuthenticated ? (
              <div className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {isLoadingBlogs
                    ? Array.from({ length: 6 }).map((_, i) => (
                      <div
                        className="border rounded-sm overflow-hidden animate-pulse"
                        style={{ backgroundColor: theme.colors.beige, borderColor: theme.colors.lightGray }}
                      >
                        <div className="aspect-video bg-black/10" />
                        <div className="p-5 space-y-3">
                          <div className="h-3 w-16 bg-black/10 rounded" />
                          <div className="h-5 w-4/5 bg-black/10 rounded" />
                          <div className="h-5 w-3/5 bg-black/10 rounded" />
                          <div className="h-3 w-full bg-black/10 rounded" />
                          <div className="h-3 w-4/5 bg-black/10 rounded" />
                          <div className="pt-2 flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-black/10" />
                            <div className="h-3 w-24 bg-black/10 rounded" />
                          </div>
                        </div>
                      </div>
                    ))
                    : blogs.map((blog) => (
                      <BlogCard key={blog._id} blog={blog} href={`/blogs/${blog._id}`} />
                    ))}
                </div>

                {!isLoadingBlogs && !error ? (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalBlogs}
                    itemsPerPage={BLOGS_PER_PAGE}
                    onPageChange={(page) => {
                      startTransition(() => {
                        setCurrentPage(page);
                      });
                    }}
                    disabled={isLoadingBlogs}
                    showItemsInfo
                  />
                ) : null}
              </div>
            ) : null}

            {isAuthenticated && !isLoadingBlogs && !error && blogs.length === 0 ? (
              <div
                className="rounded-3xl border px-6 py-14 text-center"
                style={{ background: theme.colors.white, borderColor: theme.colors.lightGray }}
              >
                <p
                  className="text-2xl"
                  style={{ color: theme.colors.charcoal, fontFamily: theme.font.heading }}
                >
                  No blogs match this search yet.
                </p>
                <p
                  className="mt-3 text-sm"
                  style={{ color: `${theme.colors.charcoal}99`, fontFamily: theme.font.body }}
                >
                  Try another keyword or switch back to the All tag.
                </p>
              </div>
            ) : null}
          </div>
        </section>
      </Main>
      <Footer />
    </div>
  )
}

export default LandingPage
