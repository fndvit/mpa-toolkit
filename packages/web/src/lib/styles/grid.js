import mapValues from 'lodash/mapValues.js';
// import mapKeys from 'lodash/mapKeys.js';
import postcss from 'postcss';

// prettier-ignore
const _gridConfig = {
  content: {
    columns: {
      large: 'minmax(64px, 96px) 220px 600px 300px minmax(64px, 96px) 1fr',
      medium: 'minmax(40px, 1fr) 240px minmax(500px, 600px) minmax(40px, 1fr)',
      small: 'minmax(20px, 1fr) minmax(200px, 600px) minmax(20px, 1fr)'
    },
    areas: {
      large: {
        splash: [
          '.    .             .             .            .',
          '.    title         title         .            .'
        ],
        chapter: [
          '.    byline        byline        .            .',
          '.    summary       summary       .            .',
          '.    keytakeaways  keytakeaways  lifecycle    .'
        ],
        'chapter-no-keytakeaways': [
          '.    byline        byline        lifecycle    .',
          '.    summary       summary       lifecycle    .'
        ],
        'case-study': [
          '.    meta          meta          meta         .',
          '.    keylearnings  keylearnings  lifecycle    .'
        ],
        content: [
          '.    menu          body          lifecycle    lifecycle'
        ],
        footer: [
          '.    footer        footer        .            .'
        ]
      },

      medium: {
        splash: [
          '.    .            .            .',
          '.    title        title        .'
        ],
        chapter: [
          '.    byline       byline       .',
          '.    summary      summary      .',
          '.    keytakeaways keytakeaways .',
          '.    lifecycle    lifecycle    .'
        ],
        'chapter-no-keytakeaways': [
          '.    byline       byline       .',
          '.    summary      summary      .',
          '.    lifecycle    lifecycle    .'
        ],
        'case-study': [
          '.    meta          meta          .',
          '.    lifecycle     lifecycle     .',
          '.    keylearnings  keylearnings  .'
        ],
        content: [
          '.    lifecycle    lifecycle    .',
        'menu body         body         .'
      ],
        footer: [
          '.    footer       footer       .']
      },

      small: {
        splash: [
          '.    .            .',
          '.    title        .'
        ],
        chapter: [
          '.    byline       .',
          '.    summary      .',
          '.    keytakeaways .',
          '.    lifecycle    .'
        ],
        'chapter-no-keytakeaways': [
          '.    byline       .',
          '.    summary      .',
          '.    lifecycle    .'
        ],
        'case-study': [
          '.    meta         .',
          '.    lifecycle    .',
          '.    keylearnings .'
        ],
        content: [
          '.    lifecycle    .',
          'menu body         .'
        ],
        footer: [
          '.    footer       .']
      }
    }
  }
};

/** @param {string} gridConfig */
const getBreakpointWidth = gridConfig => {
  const re = /(minmax\((?<min>\d+)px, (?<max>\d+(px|fr))\)|(?<fixed>\d+)px)\s*/gmy;
  const matches = [...gridConfig.matchAll(re)];
  const minColVals = matches.map(({ groups }) => Number(groups.min || groups.fixed));
  return minColVals.reduce((a, b) => a + b);
};

export const gridConfig = mapValues(_gridConfig, v => {
  const large = getBreakpointWidth(v.columns.large);
  const medium = getBreakpointWidth(v.columns.medium);
  const small = getBreakpointWidth(v.columns.small);
  return {
    ...v,
    widths: {
      large: { min: large, max: null },
      medium: { min: medium, max: large - 1 },
      small: { min: small, max: medium - 1 }
    }
  };
});

const gridCss = (page, grid, size) => {
  return `
    display: grid;
    grid-template-columns: ${gridConfig[page].columns[size]};
    grid-template-areas: ${gridConfig[page].areas[size][grid].map(v => `'${v}'`).join(' ')};
  `;
};

/** @type {Record<string, import('postcss-mixins').Mixin>} */
export const gridMixins = {
  'grid-config': (mixin, page, grid) => {
    mixin.replaceWith(
      postcss.parse(`
          ${gridCss(page, grid, 'large')}
          @mixin breakpoint ${page}, medium {
            ${gridCss(page, grid, 'medium')}
          }
          @mixin breakpoint ${page}, small {
            ${gridCss(page, grid, 'small')}
          }
      `)
    );
  },
  breakpoint: (mixin, page, size) => {
    mixin.replaceWith(
      postcss.atRule({
        name: 'media',
        params: `(max-width: ${gridConfig[page].widths[size].max}px)`,
        nodes: mixin.nodes
      })
    );
  }
};
