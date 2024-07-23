# display this help menu
list:
    @just --list

# build static site
build:
    pnpm install && pnpm build

# run dev env with livereload, for local editing
dev:
    pnpm dev
