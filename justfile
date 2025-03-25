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
  fd -t f -e md -e mdx -X markdown-link-check

# run dev env via firebase, for a more prod-like local editing experience
firebase-dev:
    @just build
    firebase emulators:start
