import { logger } from '@mpa/log';

import type { Block, ContentDocument } from './types';
const log = logger('READTIME');

const WORDS_PER_MINUTE = 265;

const CONSTANT_READ_TIMES_IN_S = {
  image: 12
};

export function calcReadTime(doc: ContentDocument): number {
  const floatTime = doc.content.map(calcBlockReadTime).reduce((a, b) => a + b, 0);
  return Math.ceil(floatTime);
}

export function calcStrReadTime(str: string): number {
  const wordCount = str.split(/\s+/).length;
  return wordCount / WORDS_PER_MINUTE;
}

export function calcBlockReadTime(block: Block): number {
  if (CONSTANT_READ_TIMES_IN_S[block.type]) {
    return CONSTANT_READ_TIMES_IN_S[block.type] / 60;
  } else if ('text' in block) {
    return calcStrReadTime(block.text);
  } else if ('content' in block && block.content) {
    return block.content.map(calcBlockReadTime).reduce((a, b) => a + b, 0);
  } else if (block.type === 'cards') {
    const allCardText = block.attrs.cards.map(({ heading, body }) => `${heading} ${body}`).join(' ');
    return calcStrReadTime(allCardText);
  } else {
    log.warn(`Unhandled node type: ${block.type}`);
    return 0;
  }
}
