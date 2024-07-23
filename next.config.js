const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx'
})
 
module.exports = withNextra({
    // Attempt to generate static site, via https://nextjs.org/docs/pages/building-your-application/deploying/static-exports
    output: 'export',
    // Disable image optimization, as it doesn't work for SSG.
    images: {
        unoptimized: true,
    },
})
 
// If you have other Next.js configurations, you can pass them as the parameter:
// module.exports = withNextra({ /* other next.js config */ })
