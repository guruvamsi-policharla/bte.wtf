import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { TAGS, papers, sortedPapers, type Tag } from "./data/papers";
import { homePage, notFoundPage, papersPage, searchText } from "./views";

const app = new Hono({ strict: false });

app.use("*", async (c, next) => {
  const url = new URL(c.req.url);
  if (url.hostname === "www.bte.wtf") {
    url.hostname = "bte.wtf";
    return c.redirect(url.toString(), 301);
  }
  await next();
});

app.use(
  "*",
  secureHeaders({
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      baseUri: ["'none'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      objectSrc: ["'none'"],
    },
  }),
);

app.use("*", async (c, next) => {
  await next();
  if (c.res.headers.get("Content-Type")?.startsWith("text/html")) {
    c.res.headers.set("Cache-Control", "public, max-age=300");
  }
});

const all = sortedPapers(papers);

app.get("/", (c) => c.html(homePage(all.slice(0, 3), all.length)));

app.get("/papers", (c) => {
  const q = (c.req.query("q") ?? "").trim().slice(0, 200);
  const tagParam = c.req.query("tag");
  const tag = TAGS.includes(tagParam as Tag) ? (tagParam as Tag) : undefined;
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const shown = all.filter(
    (p) =>
      (!tag || p.tags.includes(tag)) &&
      terms.every((t) => searchText(p).includes(t)),
  );
  return c.html(papersPage({ shown, total: all.length, q, tag, path: "/papers" }));
});

app.get("/favicon.ico", (c) => c.redirect("/favicon.svg", 301));

app.notFound((c) => c.html(notFoundPage(new URL(c.req.url).pathname), 404));

export default app;
