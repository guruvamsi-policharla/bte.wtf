# Pages are built with pandoc 3.13 (the version CI checks against): https://github.com/jgm/pandoc/releases/tag/3.13
# index.html is hand-written; every other page is a .md file compiled to .html next to it.
MD_SOURCES := $(shell find . -name "*.md" -type f)
MD_TARGETS := $(MD_SOURCES:.md=.html)

# Rebuilds a page when its .md file or the template changes
%.html: %.md template.html
	pandoc $< -o $@ --template=template.html --math-method=katex --standalone

markdown: $(MD_TARGETS)

clean:
	rm -f $(MD_TARGETS)

.PHONY: markdown clean
