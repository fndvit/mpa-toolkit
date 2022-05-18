import type { Options } from '@splidejs/splide';

export const SplideDefaults: Options = {
  arrowPath: 'M13.65 37.14 30.1 20 13.65 2.86'
};

export const SplideOptions = (options: Options): Options => ({
  ...SplideDefaults,
  ...options
});