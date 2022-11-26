import postcss from 'postcss';
import { gridConfig } from './grid.js';

const config = {
  defaults: {
    height: 1.2,
    weight: 300
  },
  htmlFontSize: '16px' // for rem calcs
};

// prettier-ignore
const fonts = {
  'sans-serif': {
    'font-family': "'Montserrat', sans-serif",
    'font-family-variable': "'MontserratVariable', sans-serif",
    styles: {
      'h1-light': '300 100px',
      'h1': '68px',
      'h1-mobile': '48px',
      'h2': '48px',
      'h2-mobile': '32px',
      'h3': '700 24px',
      'h3-mobile': '700 20px',
      'h3-light': '32px',
      'h4': '700 20px',
      'h4-light': '24px',
      'h4-graphic': '700 20px',
      'h4-graphic-mobile': '700 18px',
      'h5': '700 16px',
      'h5-mobile': '700 14px/20px',
      'h5-light': '20px',
      'h5-graphic': '700 16px/24px',
      'ui': '400 16px',
      'ui-small': '400 12px/18px',
      'ui-large': '400 20px/40px',
      'p-graphic': '400 16px/24px',
      'p-graphic-mobile': '400 14px/24px',
      'ui-link': '700 12px/18px'
    }
  },
  serif: {
    'font-family': "'Bitter', serif",
    styles: {
      'p': '400 18px/32px',
      'p-mobile': '400 16px/28px',
      'p-medium': '400 22px/36px',
      'p-large': '400 28px/42px'
    }
  }
};

// prettier-ignore
const responsiveFonts = {
  'h1-light': {
    default: 'h1-light',
    small: 'h1-mobile'
  },

  'h1': {
    default: 'h1',
    small: 'h1-mobile'
  },

  'summary-card-body': {
    default: 'p-medium',
    small: 'p-mobile'
  },

  'content-card-body': {
    default: 'p-graphic',
    small: 'p-graphic-mobile'
  },

  'h3-light': {
    default: 'h3-light',
    small: 'h5-light'
  },

  'p-graphic': {
    default: 'p-graphic',
    small: 'ui-small'
  },

  'h2': {
    default: 'h2',
    small: 'h2-mobile'
  },

  'h3': {
    default: 'h3-light',
    small: 'h3-mobile'
  },

  'h4-graphic': {
    default: 'h4-graphic',
    small: 'h4-graphic-mobile'
  },

  'h4': {
    default: 'h4',
    small: 'h5'
  },

  'h5': {
    default: 'h5',
    small: 'h5-mobile'
  },

  'h4-light': {
    default: 'h4-light',
    small: 'h5-light'
  },

  'p-large': {
    default: 'p-large',
    small: 'p'
  },

  'p': {
    default: 'p',
    small: 'p-mobile'
  },

  'ui-large': {
    default: 'ui-large',
    small: 'ui'
  }
};

/** @param {string} style */
const normalize = style => {
  const re = /^((?<weight>\d+) )?(?<size>\d+)px\s*(\/\s*(?<height>\d+)px)?$/gmy;
  const m = re.exec(style.trim());
  if (!m || !m.groups) throw new Error(`Invalid font style: ${style}`);
  const { size: sizePx, weight = config.defaults.weight, height: heightPx } = m.groups;
  const height = heightPx ? Number(heightPx) / Number(sizePx) : config.defaults.height;
  const pxToRem = px => (parseFloat(px) / parseFloat(config.htmlFontSize)).toPrecision(3);
  return `${weight} ${pxToRem(sizePx)}rem / ${height.toPrecision(3)}`;
};

export const fontVars = Object.fromEntries(
  Object.entries(fonts).flatMap(([groupName, { styles }]) => {
    return Object.entries(styles).map(([styleName, style]) => [
      `f-${styleName}`,
      `${normalize(style)} var(--font-${groupName})`
    ]);
  })
);

/** @type {Record<string, import('postcss-mixins').Mixin>} */
export const fontMixins = {
  'font-responsive': (mixin, font) => {
    const responsiveStyle = responsiveFonts[font];
    mixin.replaceWith(
      postcss.parse(`
      font: $f-${responsiveStyle.default};
      @media (max-width: ${gridConfig.content.widths.small.max}px) {
        font: $f-${responsiveStyle.small};
      }
    `)
    );
  }
};
