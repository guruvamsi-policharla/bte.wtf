# bte.wtf

[bte.wtf](https://bte.wtf) is a small website that lists research papers on **batched threshold encryption (BTE)**.

The whole site is one web page, `public/index.html`, plus a stylesheet, `public/style.css`. Nothing needs to be installed or built.

## Adding a paper

1. Open `public/index.html`. On GitHub you can click the pencil icon to edit it in your browser.
2. Find the comment that starts with `HOW TO ADD A PAPER`. Copy the example block in it, which starts at `<div class="paper">` and ends at `</div>`.
3. Paste it into the list, keeping the list newest first. Fill in:
   - the title, exactly as it appears on ePrint;
   - the authors, in the paper's order;
   - the venue and year, or "Preprint" and the year;
   - the ePrint link, which appears twice in the block.
4. Open a pull request. Please only add details you can check on the paper or its ePrint page.

## Previews and publishing

- Every pull request gets a Cloudflare preview. A bot comments on the pull request with a link, so you can see the change before merging.
- Merging into `main` publishes the site to bte.wtf automatically.

## Optional: viewing the site on your own computer

If you have [Node.js](https://nodejs.org) installed, run `npx wrangler dev` in this folder and open <http://localhost:8787>. You can also just open `public/index.html` in a browser.

## License

[MIT](LICENSE), © 2026 Guru Vamsi Policharla.
