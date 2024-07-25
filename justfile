# display this help menu
list:
    @just --list

# build static site
build:
    pnpm install && pnpm build

# run dev env with livereload, for local editing
dev:
    pnpm dev

# run dev env via firebase, for a more prod-like local editing experience
firebase-dev:
    @just build
    firebase emulators:start
