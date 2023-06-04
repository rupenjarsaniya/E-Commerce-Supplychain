import sanityClient from '@sanity/client';

export const client = sanityClient({
  projectId: 'goktoa75',
  dataset: 'production',
  apiVersion: 'v1',
  token:
    'skILWISQqY3Df6z2O3wvaNyh4bZ3iDnrhuJhgE6gFdBSmWV8OaTeH6wFe7jJ11tzRDgmwHkzabZADvNvD0kiahw9VLYEEwJqsZe0rMFFTLIfridMEdnvOeDxokd6DsljXCRimLyJsJ0gclk1T7P7SWTAaPQhD8z43xUEWGwqMbjKQSNIiJdf',
  useCdn: false,
});
