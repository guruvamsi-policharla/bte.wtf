import { html } from "hono/html";
import type { HtmlEscapedString } from "hono/utils/html";
import { TAGS, type Paper, type Tag } from "./data/papers";

type Html = HtmlEscapedString | Promise<HtmlEscapedString>;

export const SITE = {
  name: "bte.wtf",
  url: "https://bte.wtf",
  repo: "https://github.com/guruvamsi-policharla/bte.wtf",
  description: "A minimal resource on batched threshold encryption (BTE): papers and pointers.",
};

type NavKey = "home" | "papers";

interface LayoutOptions {
  title?: string;
  description?: string;
  path: string;
  nav?: NavKey;
  scripts?: string[];
  body: Html;
}

export function layout(o: LayoutOptions): Html {
  const title = o.title ? `${o.title} · ${SITE.name}` : `${SITE.name} · batched threshold encryption`;
  const description = o.description ?? SITE.description;
  const current = (key: NavKey) => (o.nav === key ? html` aria-current="page"` : "");
  return html`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${SITE.url}${o.path}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${SITE.url}${o.path}">
<meta property="og:type" content="website">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/courier-prime-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/style.css">
${(o.scripts ?? []).map((src) => html`<script src="${src}" defer></script>`)}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <a class="wordmark" href="/"${current("home")}>bte.wtf</a>
  <nav aria-label="Main">
    <ul>
      <li><a href="/papers"${current("papers")}>papers</a></li>
      <li><a href="${SITE.repo}">github</a></li>
    </ul>
  </nav>
</header>
<main id="main">
${o.body}
</main>
<footer class="site-footer">
  <p>Maintained in the open. Spotted a missing paper or an error? <a href="${SITE.repo}/blob/main/CONTRIBUTING.md">Open a pull request</a>.</p>
</footer>
</body>
</html>`;
}

function joinAuthors(authors: readonly string[]): string {
  if (authors.length <= 2) return authors.join(" and ");
  return `${authors.slice(0, -1).join(", ")}, and ${authors[authors.length - 1]}`;
}

function eprintId(url: string | undefined): string | undefined {
  return url?.match(/eprint\.iacr\.org\/(\d{4}\/\d+)/)?.[1];
}

function primaryLink(p: Paper): string | undefined {
  return p.links.eprint ?? p.links.doi ?? p.links.pdf ?? p.links.code;
}

function tagHref(tag: Tag): string {
  return `/papers?tag=${encodeURIComponent(tag)}`;
}

/** Lowercased text the search box matches against, on the server and in papers.js. */
export function searchText(p: Paper): string {
  return [p.title, ...p.authors, p.venue ?? "", String(p.year), ...p.tags, p.summary ?? "", eprintId(p.links.eprint) ?? ""]
    .join(" ")
    .toLowerCase();
}

function paperItem(p: Paper): Html {
  const href = primaryLink(p);
  const eid = eprintId(p.links.eprint);
  const meta = [p.venue ?? `Preprint, ${p.year}`, eid ? `ePrint ${eid}` : ""].filter(Boolean).join(" · ");
  const pills: [string, string | undefined][] = [
    ["ePrint", p.links.eprint],
    ["PDF", p.links.pdf],
    ["DOI", p.links.doi],
    ["Code", p.links.code],
  ];
  return html`<li class="paper" id="${p.id}" data-search="${searchText(p)}" data-tags="${p.tags.join(" ")}">
  <h3 class="paper-title">${href ? html`<a href="${href}">${p.title}</a>` : p.title}</h3>
  <p class="paper-authors">${joinAuthors(p.authors)}</p>
  <p class="paper-meta">${meta}</p>
  ${p.summary ? html`<p class="paper-summary">${p.summary}</p>` : ""}
  <ul class="paper-links" aria-label="Links and tags">
    ${pills
      .filter((pill): pill is [string, string] => Boolean(pill[1]))
      .map(([label, url]) => html`<li><a class="pill" href="${url}">${label}</a></li>`)}
    ${p.tags.map((t) => html`<li><a class="tag" href="${tagHref(t)}">#${t}</a></li>`)}
  </ul>
</li>`;
}

function groupByYear(list: readonly Paper[]): [number, Paper[]][] {
  const groups = new Map<number, Paper[]>();
  for (const p of list) {
    const g = groups.get(p.year);
    if (g) g.push(p);
    else groups.set(p.year, [p]);
  }
  return [...groups.entries()];
}

interface PapersPageOptions {
  shown: readonly Paper[];
  total: number;
  q: string;
  tag?: Tag;
  path: string;
}

export function papersPage(o: PapersPageOptions): Html {
  const filtered = o.shown.length !== o.total;
  const count = filtered
    ? `Showing ${o.shown.length} of ${o.total} papers.`
    : `${o.total} papers, newest first.`;
  const body = html`<h1>Papers</h1>
<p>Research on batched threshold encryption and closely related primitives. Missing something? <a href="${SITE.repo}/blob/main/CONTRIBUTING.md">Add it with a pull request</a>.</p>

<form class="filter" method="get" action="/papers" role="search">
  <label for="q">Search</label>
  <input id="q" name="q" type="search" value="${o.q}" placeholder="title, author, venue, tag" autocomplete="off">
  ${o.tag ? html`<input type="hidden" name="tag" value="${o.tag}">` : ""}
  <button type="submit">Filter</button>
</form>
<p class="tag-filter">
  <span class="muted">Tags:</span>
  ${TAGS.map(
    (t) => html`<a class="tag" href="${o.tag === t ? "/papers" : tagHref(t)}"${o.tag === t ? html` aria-current="true"` : ""}>#${t}</a> `,
  )}
  ${o.tag || o.q ? html`<a class="clear" href="/papers">clear</a>` : ""}
</p>
<p class="count muted" id="count" aria-live="polite" data-total="${o.total}">${count}</p>

${groupByYear(o.shown).map(
  ([year, list]) => html`<section class="year" aria-labelledby="y${year}">
<h2 id="y${year}">${year}</h2>
<ol class="papers">
${list.map(paperItem)}
</ol>
</section>`,
)}
${o.shown.length === 0 ? html`<p class="empty">No papers match. <a href="/papers">Show all papers</a>.</p>` : ""}
<p class="empty" id="no-match" hidden>No papers match.</p>`;
  return layout({
    title: "Papers",
    description: "Papers on batched threshold encryption (BTE), newest first.",
    path: o.path,
    nav: "papers",
    scripts: ["/papers.js"],
    body,
  });
}

export function homePage(latest: readonly Paper[], total: number): Html {
  const body = html`<h1>Batched threshold encryption</h1>
<p>In <em>batched threshold encryption</em> (BTE), users encrypt to a committee of servers. Later, the committee can decrypt any chosen batch of <var>B</var> ciphertexts with communication that is independent of, or sublinear in, <var>B</var>. Ciphertexts outside the batch stay hidden as long as fewer than a threshold of servers collude.</p>
<p>The main application is <em>encrypted mempools</em>: transactions stay private until they are included in a block, which protects users from front-running and other forms of MEV.</p>
<p>This site collects the research on BTE in one place. It is maintained by hand and is open to contributions.</p>

<h2>Recent papers</h2>
<ul class="latest">
${latest.map((p) => html`<li><a href="/papers#${p.id}">${p.title}</a> <span class="muted">(${p.year})</span></li>`)}
</ul>
<p><a href="/papers">All ${total} papers</a></p>`;
  return layout({ path: "/", nav: "home", body });
}

export function notFoundPage(path: string): Html {
  return layout({
    title: "Not found",
    path,
    body: html`<h1>Not found</h1>
<p>Nothing lives at <code>${path}</code>. Try the <a href="/papers">papers</a>.</p>`,
  });
}
