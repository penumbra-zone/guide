export default {
  logo: <span>Penumbra Guide</span>,
  project: {
    link: 'https://github.com/penumbra-zone/guide'
  },
  footer: {
    text: ''
  },
  docsRepositoryBase: 'https://github.com/penumbra-zone/guide',
  // ... other theme options
  useNextSeoProps() {
    return {
      // Set "Penumbra Guide" in page titles, rather than default "Nextra".
      // The `%s` is the title of the markdown document being displayed.
      titleTemplate: '%s – Penumbra Guide'
    }
  },
}
