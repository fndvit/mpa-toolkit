// prettier-ignore

const colorPalette = {
  'highlight-1': '#FBE26B',
  'neutral-bg': '#F9F9F9',
  'neutral-black': '#2A2A2A',
  'primary-blue': '#096EAE',
  'neutral-dark': '#6C767D',
  'secondary-bg': '#E5E5E5',
  'neutral-light': '#D9D9D9',
  'deep-blue': '#13487C',
  'dark-blue': '#04558E',
  'ocean': '#2186B7',
  'tag-bg-cards': '#DADCE0',
  'editor-placeholder': '#AAAAAA',
  'lifecycle-bg': '#66CFD6',
  'error-red': '#9f1a1a'
};

/**
 * maps names to var names for use in postcss e.g.
 * highlight-1 -> $c-highlight-1
 */
export const colors = Object.fromEntries(Object.entries(colorPalette).map(([name, value]) => [`c-${name}`, value]));
