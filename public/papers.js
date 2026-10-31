// Optional live filtering for /papers. The page works without it: the search form submits to the server.
(() => {
  const input = document.getElementById("q");
  const count = document.getElementById("count");
  const none = document.getElementById("no-match");
  if (!input || !count) return;
  const items = [...document.querySelectorAll("li.paper")];
  const sections = [...document.querySelectorAll("section.year")];
  const total = count.dataset.total;
  const initial = count.textContent;

  input.addEventListener("input", () => {
    const terms = input.value.toLowerCase().split(/\s+/).filter(Boolean);
    let shown = 0;
    for (const li of items) {
      const hit = terms.every((t) => li.dataset.search.includes(t));
      li.hidden = !hit;
      if (hit) shown++;
    }
    for (const s of sections) s.hidden = !s.querySelector("li.paper:not([hidden])");
    if (none) none.hidden = shown > 0 || items.length === 0;
    count.textContent = terms.length ? `Showing ${shown} of ${total} papers.` : initial;
  });
})();
