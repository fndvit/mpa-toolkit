import type { Node } from "prosemirror-model";
import type { Schema } from "./Editor/schema";
import { logger } from "./log";

const log = logger.child({module: 'readtime'});

function calcBlockNodeReadTime(node: Node<Schema>): number {
  const TEXT_NODES = ['paragraph', 'heading', 'blockquote', 'cards'];
  const WORDS_PER_MINUTE = 265;
  const SECS_PER_IMG = 12;

  if (TEXT_NODES.indexOf(node.type.name) > -1) {
    const wordCount = node.textContent.split(/\s+/).length;
    return wordCount / WORDS_PER_MINUTE;
  }
  else if (node.type.name === 'image') {
    return SECS_PER_IMG / 60;
  }
  else {
    log.warn(`Unhandled node type: ${node.type.name}`);
    return 0;
  }
}

export function calcReadTime(node: Node<Schema>) {
  let mins = 0;
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    mins += calcBlockNodeReadTime(child);
  };
  return Math.ceil(mins);
}
