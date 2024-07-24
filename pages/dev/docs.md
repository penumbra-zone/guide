# Building documentation

## Penumbra guide
The [guide] (i.e. this document) is build using [Nextra],
and the source config lives in the [guide repo]. See that repo's README
for setup instructions.

## Protocol docs
The [protocol docs] are maintained in the [protocol repo], and are built using [mdBook].
To build locally, [set up the dev env](dev-env.mdx), then run:

```shell
cd docs/protocol
mdbook serve
```

## Rust API docs
The [Rust API docs][rustdoc] are maintained in the [protocol repo], and
can be built with `./deployments/scripts/rust-docs`. Notably, the rust docs
require the use of a nightly rust toolchain, which isn't currently provided via the
[dev env](dev-env.md). You should install the nightly toolchain on your host machine,
if you need to build the rustdocs locally.

The landing page, the top-level `index.html`, is handled as a special case.
If you added new crates by appending a `-p <crate_name>` to the `rust-docs` script,
then you must rebuild the index page by running the custom script.

## Static site hosting
All the documentation sites listed above use [Firebase] for static web hosting.
To debug Firebase-specific functionality like redirects,
use `firebase emulators:start` to run a local webserver. You'll need to rebuild the docs
with the appropriate tooling to get livereload functionality, however, e.g. `mdbook serve`
or `pnpm dev`, depending on the site.

[protocol docs]: https://protocol.penumbra.zone
[protocol repo]: https://github.com/penumbra-zone/penumbra
[rustdoc]: https://rustdoc.penumbra.zone
[guide]: https://guide.penumbra.zone
[mdBook]: https://rust-lang.github.io/mdBook/
[Firebase]: https://firebase.google.com/docs/functions/local-emulator#install_the_firebase_cli
[Nextra]: https://nextra.site
[guide repo]: https://github.com/penumbra-zone/guide
