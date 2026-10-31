MD_SOURCES := $(shell find . -name "*.md" -type f)
MD_TARGETS := $(MD_SOURCES:.md=.html)

# Rebuilds a page when its .md file or the template changes
%.html: %.md template.html
	pandoc $< -o $@ --template=template.html --katex --standalone

markdown: $(MD_TARGETS)

clean:
	rm -rf $(MD_TARGETS)

.PHONY: markdown clean
