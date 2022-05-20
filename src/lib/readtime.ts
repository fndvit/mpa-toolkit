import { logger } from "./log";

import type { Block, ContentDocument } from "./types";
const log = logger.child({module: 'readtime'});

export function calcReadTime(doc: ContentDocument): number {
  const floatTime = doc.content.map(calcBlockReadTime).reduce((a, b) => a + b, 0);
  return Math.ceil(floatTime);
}

export function calcBlockReadTime(block: Block): number {
  const WORDS_PER_MINUTE = 265;
  const CONSTANT_READ_TIMES_IN_S = {
    image: 12,
  };

  if (CONSTANT_READ_TIMES_IN_S[block.type]) {
    return CONSTANT_READ_TIMES_IN_S[block.type] / 60;
  }
  else if ('text' in block) {
    const wordCount = block.text.split(/\s+/).length;
    return wordCount / WORDS_PER_MINUTE;
  }
  else if ('content' in block) {
    return block.content
      .map(calcBlockReadTime)
      .reduce((a, b) => a + b, 0);
  } else {
    log.warn(`Unhandled node type: ${block.type}`);
    return 0;
  }
}
