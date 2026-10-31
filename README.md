# bte.wtf

The source for [bte.wtf](https://bte.wtf), a website about batched threshold encryption.

Pages are written in Markdown (`.md` files) in the `public/` folder. A tool called pandoc turns each `.md` file into the `.html` web page that people see. You run that conversion yourself and commit both files. Cloudflare then publishes the `public/` folder as is.

## One-time setup

Install pandoc. On a Mac with [Homebrew](https://brew.sh):

```sh
brew install pandoc
```

Other systems: see [pandoc.org/installing](https://pandoc.org/installing.html). `make` comes with macOS. If it is missing, run `xcode-select --install`.

## Editing or adding a page

1. Edit a `.md` file in `public/`, or create a new one. For example, `public/papers.md` becomes `bte.wtf/papers`. Start each file with a title, like this:

   ```markdown
   ---
   title: Papers
   ---

   # Papers

   Math works too: $e(g, h)^{ab}$
   ```

2. Open a terminal in the `public/` folder and run:

   ```sh
   make
   ```

   This creates or updates the matching `.html` file next to each `.md` file.

3. Commit **both** the `.md` file and the generated `.html` file, then open a pull request.

4. Cloudflare comments on the pull request with a preview link. Open it to check the page.

5. Merge the pull request into `main`. Cloudflare deploys the site automatically. It is not public yet; see "Going live" below.

## What the files are

- `public/*.md`: the pages, written in Markdown.
- `public/*.html`: the web pages generated from them. Don't edit these by hand; edit the `.md` file and run `make`.
- `public/template.html`: the shared page layout used for every page.
- `public/style.css`: the look of the site.
- `public/makefile`: the instructions `make` follows to run pandoc.
- `public/.assetsignore`: keeps the `.md` files, the makefile and the template off the live site.
- `wrangler.jsonc`: Cloudflare settings.

To look at the site on your own computer before opening a pull request, run `npx wrangler dev` in the main folder and open <http://localhost:8787>. This needs [Node.js](https://nodejs.org).

## Going live

The site is not public yet. Merging into `main` deploys it, but it isn't reachable at bte.wtf or at a public workers.dev address. Only the pull request preview links work.

To go live, add these lines to `wrangler.jsonc`, next to `"workers_dev": false`, and merge:

```jsonc
"routes": [
  { "pattern": "bte.wtf", "custom_domain": true },
  { "pattern": "www.bte.wtf", "custom_domain": true }
],
```

## License

[MIT](LICENSE), © 2026 Guru Vamsi Policharla.
