# bte.wtf

A small, hand-maintained resource on **batched threshold encryption (BTE)**. BTE lets a committee of servers decrypt any chosen batch of ciphertexts with communication independent of (or sublinear in) the batch size, while ciphertexts outside the batch stay private. Its main application is encrypted mempools.

Right now the site has a home page and a [papers](https://bte.wtf/papers) page. Contributions are welcome: see [CONTRIBUTING.md](CONTRIBUTING.md) to add a paper.

## How it works

The whole site is a single [Cloudflare Worker](https://developers.cloudflare.com/workers/) written in TypeScript with [Hono](https://hono.dev). Pages are rendered on the server from template-string view functions. There is no static site generator and no build step: `wrangler deploy` bundles the Worker with esbuild.

```
src/
  index.ts        routes (Hono app)
  views.ts        HTML layout and page templates
  data/papers.ts  the bibliography: one typed array of papers
public/           static assets served directly by Workers Static Assets
  style.css       all of the CSS, hand-written
  papers.js       optional live search; the page works without JS
  fonts/          Courier Prime (SIL OFL 1.1, see fonts/OFL.txt)
  favicon.svg
  _headers        cache and security headers for static files
wrangler.jsonc    Worker config
```

Each paper in `src/data/papers.ts` is typed by the `Paper` interface. The optional `scheme` field (setup type, ciphertext size, partial decryption size, decryption cost, assumptions, and so on) is not rendered yet. It exists so that a comparison table, or a machine-readable endpoint, can be built from the same data later.

## Running locally

Requires Node.js 18 or newer.

```sh
npm install
npx wrangler dev      # or: npm run dev
```

Then open <http://localhost:8787>. Edits to `src/` and `public/` reload automatically.

Type-check with:

```sh
npx tsc --noEmit      # or: npm run typecheck
```

## Deploying

```sh
npx wrangler login    # once
npx wrangler deploy   # or: npm run deploy
```

`wrangler.jsonc` declares `bte.wtf` and `www.bte.wtf` as [custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/). The `bte.wtf` zone must be on the same Cloudflare account that you deploy from. Requests to `www.bte.wtf` are redirected to `bte.wtf` by the Worker.
