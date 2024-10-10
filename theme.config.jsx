import { useConfig } from 'nextra-theme-docs';

export default {
  logo: <span>Penumbra Guide</span>,
  project: {
    link: 'https://github.com/penumbra-zone/guide',
  },
  chat: {
    link: 'https://discord.gg/hKvkrqa3zC',
  },
  footer: {
    component: null,
  },
  docsRepositoryBase: 'https://github.com/penumbra-zone/guide/tree/main',

  useNextSeoProps() {
    return {
      // Set "Penumbra Guide" in page titles, rather than default "Nextra".
      // The `%s` is the title of the Markdown document being displayed.
      titleTemplate: '%s – Penumbra Guide',
    };
  },

  head: function useHead() {
    const { title: pageTitle } = useConfig();

    const title = pageTitle
      ? pageTitle + ' – Penumbra Guide'
      : 'Penumbra Guide';
    const description =
      'Penumbra is a shielded, cross-chain network allowing anyone to securely transact, stake, swap, or marketmake without broadcasting their personal information to the world.';
    const domain = 'guide.penumbra.zone';
    const url = `https://${domain}`;
    const logo = `${url}/logo.png`;

    return (
      <>
        <meta name="msapplication-TileColor" content="#fff" />
        <meta name="theme-color" content="#fff" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Language" content="en" />

        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

        <meta name="og:title" content={title} />
        <meta name="og:description" content={description} />
        <meta name="og:image" content={logo} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site:domain" content={domain} />
        <meta name="twitter:url" content={url} />
        <meta name="twitter:image" content={logo} />
      </>
    );
  },
};
