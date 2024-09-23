import nextra from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx'
})

export default withNextra({
    // Attempt to generate static site, via https://nextjs.org/docs/pages/building-your-application/deploying/static-exports
    output: 'export',
    // Disable image optimization, as it doesn't work for SSG.
    images: {
        unoptimized: true,
    },
})
