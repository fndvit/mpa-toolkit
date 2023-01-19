import type { Node } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import type { Placement } from '@popperjs/core';
import type { NodeName } from './schema';
import { findAllMatches } from '$lib/helpers/utils';

export type FormattingError = {
  rule: NodeRule;
  from: number;
  to: number;
};

type NodeRule = {
  blocks: NodeName[];
  name: string;
  type: 'error' | 'todo';
  msg: string;
  inline?: boolean;
  tooltipPos?: Placement;
  tooltipTarget?: string;
  check: (node: Node, parent: Node) => { from: number; to: number }[] | boolean;
};

class FormattingPlugin extends Plugin<{ decorations: DecorationSet; problems: FormattingError[] }> {
  rules: { [k in NodeName]?: NodeRule[] } = {};
  lastResult: FormattingError[];

  constructor(options: { rules: { [key: string]: Omit<NodeRule, 'name'> } }) {
    super({
      state: {
        init: (_, { doc }) => this.runFormatting(doc),
        apply: (tr, old) => (tr.docChanged ? this.runFormatting(tr.doc) : old)
      },
      props: {
        decorations: state => this.getState(state).decorations
      }
    });
    Object.entries(options.rules).forEach(([name, rule]) => this.addNodeRule({ name, ...rule }));
  }

  runFormatting(doc: Node) {
    const problems = this.checkFormatting(doc);
    const decos = problems
      .map(prob => {
        // if pos is a prosemirror node
        const node = doc.nodeAt(prob.from);
        return {
          ...prob,
          decorationFn: node && node.nodeSize === prob.to - prob.from ? 'node' : 'inline'
        };
      })
      .map(prob =>
        Decoration[prob.decorationFn](prob.from, prob.to, {
          class: 'problem',
          'data-hover-msg': prob.rule.msg,
          'data-problem-name': prob.rule.name,
          'data-problem-type': prob.rule.type,
          'data-tooltip-placement': prob.rule.tooltipPos,
          'data-tooltip-target': prob.rule.tooltipTarget
        })
      );
    return { decorations: DecorationSet.create(doc, decos), problems };
  }

  checkFormatting(doc: Node) {
    const result: FormattingError[] = [];
    const record = (rule: NodeRule, from: number, to: number) => result.push({ rule, from, to });
    doc.descendants((node, pos, parent) => {
      const rules = this.rules[(node.isInline ? parent : node).type.name as NodeName] || [];
      rules
        .filter(rule => (rule.inline || false) === node.isInline)
        .forEach(rule => {
          const r = rule.check(node, parent);
          if (r === true) {
            record(rule, pos, pos + node.nodeSize);
          } else if (r instanceof Array) {
            r.forEach(({ from, to }) => record(rule, pos + from, pos + to));
          }
        });
    });
    this.lastResult = result;
    return result;
  }

  addNodeRule(rule: NodeRule) {
    if (!Array.isArray(rule.blocks)) {
      this.addNodeRule({ ...rule, blocks: [rule.blocks] });
    } else {
      rule.blocks.forEach(nodeType => {
        this.rules[nodeType] = this.rules[nodeType] ?? [];
        this.rules[nodeType].push(rule);
      });
    }
  }
}

export const formattingPlugin = new FormattingPlugin({
  rules: {
    'leading-space': {
      blocks: ['paragraph', 'heading'],
      type: 'error',
      msg: 'Blocks should not start with a space',
      check: node => {
        const m = /^\s+/.exec(node.textContent);
        return m ? [{ from: 0, to: m[0].length + 1 }] : false;
      }
    },
    'custom-bullets': {
      blocks: ['paragraph'],
      type: 'error',
      msg: 'Use built-in bullet points',
      check: node => {
        const m = /^ *● */.exec(node.textContent);
        return m ? [{ from: 0, to: m[0].length + 1 }] : false;
      }
    },
    todo: {
      blocks: ['paragraph', 'heading'],
      type: 'todo',
      inline: true,
      msg: 'TODO item',
      check: node => {
        const matches = findAllMatches(node.textContent, /\*TODO.*?\*/g);
        return matches ? matches.map(m => ({ from: m.index, to: m.index + m[0].length })) : false;
      }
    },
    'double-space': {
      blocks: ['paragraph', 'heading'],
      type: 'error',
      inline: true,
      msg: 'Multiple spaces',
      check: (node, parent) => {
        const matches = findAllMatches(node.textContent, /(?<!(\*TODO:[^*]*))\s\s+/g);
        // pop first match if it's at the start of a block (handled by leading-space rule)
        if (matches[0]?.index === 0 && parent.child(0) === node) matches.shift();
        return matches ? matches.map(m => ({ from: m.index, to: m.index + m[0].length })) : false;
      }
    },
    'link-cards-heading': {
      blocks: ['linkcards'],
      type: 'error',
      msg: 'LinkCards require a heading',
      tooltipPos: 'top',
      check: node => node.attrs.title?.length === 0
    },
    'collapse-text': {
      blocks: ['collapse'],
      type: 'error',
      tooltipTarget: '.expand-button button',
      msg: 'Expand buttons should have a custom label',
      check: node => (node.attrs.showmore?.length === 0 ? true : false)
    }
  }
});
