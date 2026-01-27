// ============================================
// REKAIRE - Sanity Image URL Builder
// ============================================

import { createImageUrlBuilder } from '@sanity/image-url';

// Type pour les sources d'images Sanity
type SanityImageSource = {
  _type?: string;
  asset?: {
    _ref?: string;
    _type?: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

const builder = createImageUrlBuilder({
  projectId: '4dwntvw6',
  dataset: 'production',
});

export const urlForImage = (source: SanityImageSource) => {
  return builder.image(source);
};
