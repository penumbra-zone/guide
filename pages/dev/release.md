# Cutting a new release

## Protocol repo release

When a new version is ready for shipping in the [protocol repo],
follow these steps to release it:

1. Edit branch protections to temporarily allow pushes to `main`
2. Check out main branch locally, make sure it's up to date.
3. Run `cargo release --no-publish --execute 1.2.3` where `1.2.3` is the version.
4. `git push origin main && git push origin v1.2.3`, again substituting the real version number.
5. Re-enable branch protections.

It'll take ~30m for all the release workflows to run, including building binaries and publishing crates.

[protocol repo]: https://github.com/penumbra-zone/penumbra
