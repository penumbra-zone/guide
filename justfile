# display this help menu
list:
    @just --list

# build static site
build:
    pnpm install && pnpm build

# run dev env with livereload, for local editing
dev:
    pnpm dev

# run linters, checking for valid links
lint:
  fd -t f -e md -e mdx -X markdown-link-check --config .markdown-link-check.json

# generate PNG and SVG images of the architecture diagrams
architecture-diagrams:
  # Exporting Mermaid architecture diagrams to PNG and SVG...
  fd -e mermaid . pages/event-indexing/ -x mmdc --backgroundColor "#2D2D2D" --theme dark --height 1800 --width 1200 -i "{}" -o "{.}.png"
  fd -e mermaid . pages/event-indexing/ -x mmdc --backgroundColor "#2D2D2D" --theme dark -i "{}" -o "{.}.svg"
  # Exported files can be found at:
  fd -e png -e svg . pages/event-indexing --no-ignore

# run dev env via firebase, for a more prod-like local editing experience
firebase-dev:
    @just build
    firebase emulators:start
