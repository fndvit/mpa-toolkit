import nested from 'postcss-nested';
import postcssMixins from 'postcss-mixins';
import postcssImport from 'postcss-import';
import postcssColorFunction from 'postcss-color-function';
import postcssSimpleVars from 'postcss-simple-vars';
import { gridMixins } from './grid.js';
import { colors } from './colors.js';
import { fontMixins, fontVars } from './fonts.js';

const zIndex = {
  'z-lifecycle': 2,
  'z-sticky-menu': 3,
  'z-editor-menubar': 5,
  'z-authors-list': 10,
  'z-tooltip': 15,
  'z-modal': 20,
  'z-toast': 30
};

const extraConfig = {
  'lifecycle-overlap': '200px'
};

/** @type {import('postcss').AcceptedPlugin[]} */
export const plugins = [
  postcssImport,
  postcssMixins({
    mixins: {
      ...gridMixins,
      ...fontMixins
    }
  }),
  nested(),
  postcssSimpleVars({
    variables: {
      ...fontVars,
      ...zIndex,
      ...colors,
      ...extraConfig
    }
  }),
  postcssColorFunction()
  // colorGuard()
];
