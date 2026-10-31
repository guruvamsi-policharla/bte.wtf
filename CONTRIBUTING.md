# Contributing

Thanks for helping keep bte.wtf complete and accurate. The most useful contribution is a missing paper or a correction to an existing entry.

## Adding a paper

1. Open [`src/data/papers.ts`](src/data/papers.ts).
2. Append one object to the `papers` array. Order does not matter; the site sorts papers newest first.
3. Run `npx tsc --noEmit` to check the entry, and optionally `npx wrangler dev` to see it at <http://localhost:8787/papers>.
4. Open a pull request with a link to the paper.

Example entry:

```ts
{
  id: "cgpp24",
  title: "Mempool Privacy via Batched Threshold Encryption: Attacks and Defenses",
  authors: ["Arka Rai Choudhuri", "Sanjam Garg", "Julien Piet", "Guru-Vamsi Policharla"],
  year: 2024,
  venue: "USENIX Security 2024",
  links: {
    eprint: "https://eprint.iacr.org/2024/669",
    pdf: "https://eprint.iacr.org/2024/669.pdf",
  },
  tags: ["mempool-privacy", "implementation"],
  summary: "Introduces batched threshold encryption, ...",
},
```

### Conventions

- **Accuracy first.** Copy the title and authors exactly as they appear on the paper or its ePrint page. If you are not sure about a field, leave it out.
- **`id`**: a short, unique, lowercase slug, used as the URL anchor (`/papers#cgpp24`). We use alpha-style citation keys: the first letter of each author's surname plus the two-digit year (`cgpp24`), the first three letters for a single author (`pol26`), or the first three authors' initials for five or more authors (`bcf25`). Add `a`, `b`, … to break ties.
- **`year`**: the year the paper first appeared. For ePrint papers, use the ePrint year.
- **`venue`**: the peer-reviewed venue with its year, e.g. `"CRYPTO 2025"`. Leave it out for preprints.
- **`links`**: all optional. Prefer the ePrint landing page for `eprint`, a full `https://doi.org/...` URL for `doi`, and the authors' official repository for `code`.
- **`tags`**: pick from `TAGS` at the top of the file. If none fits, add a new tag to `TAGS` in the same PR.
- **`summary`**: optional, one plain-text sentence stating what the paper does, in neutral language.
- **`scheme`**: optional properties for a future comparison table (setup type, ciphertext size, decryption cost, assumptions, ...). Only fill in what the paper states explicitly.

## Other changes

For changes to the site itself, keep to the existing approach: server-rendered HTML in `src/views.ts`, hand-written CSS in `public/style.css`, no frameworks, and no JavaScript that the page depends on. Make sure `npx tsc --noEmit` passes.
