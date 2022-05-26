import { staticUrl } from '$lib/helpers/content';
import { Schema as ProsemirrorSchema } from 'prosemirror-model';

export const schema = new ProsemirrorSchema({
  nodes: {
    // :: NodeSpec The top level document node.
    doc: {
      content: 'block+'
    },

    // :: NodeSpec A plain paragraph textblock. Represented in the DOM
    // as a `<p>` element.
    paragraph: {
      content: 'inline*',
      group: 'block',
      parseDOM: [{ tag: 'p' }],
      toDOM() {
        return ['p', 0];
      }
    },

    // :: NodeSpec A blockquote (`<blockquote>`) wrapping one or more blocks.
    blockquote: {
      content: 'block+',
      group: 'block',
      defining: true,
      parseDOM: [{ tag: 'blockquote' }],
      toDOM() {
        return ['blockquote', 0];
      }
    },

    // :: NodeSpec A horizontal rule (`<hr>`).
    horizontal_rule: {
      group: 'block',
      parseDOM: [{ tag: 'hr' }],
      toDOM() {
        return ['hr'];
      }
    },

    // :: NodeSpec A heading textblock, with a `level` attribute that
    // should hold the number 1 to 6. Parsed and serialized as `<h1>` to
    // `<h6>` elements.
    heading: {
      attrs: { level: { default: 1 } },
      content: 'inline*',
      group: 'block',
      defining: true,
      parseDOM: [
        { tag: 'h1', attrs: { level: 1 } },
        { tag: 'h2', attrs: { level: 2 } },
        { tag: 'h3', attrs: { level: 3 } },
        { tag: 'h4', attrs: { level: 4 } },
        { tag: 'h5', attrs: { level: 5 } },
        { tag: 'h6', attrs: { level: 6 } }
      ],
      toDOM(node) {
        return ['h' + node.attrs.level, 0];
      }
    },

    // :: NodeSpec A code listing. Disallows marks or non-text inline
    // nodes by default. Represented as a `<pre>` element with a
    // `<code>` element inside of it.
    code_block: {
      content: 'text*',
      marks: '',
      group: 'block',
      code: true,
      defining: true,
      parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }],
      toDOM() {
        return ['pre', ['code', 0]];
      }
    },

    // :: NodeSpec The text node.
    text: {
      group: 'inline'
    },

    // :: NodeSpec An inline image (`<img>`) node. Supports `src`,
    // `alt`, and `href` attributes. The latter two default to the empty
    // string.
    image: {
      attrs: {
        src: {},
        alt: { default: null },
        title: { default: null }
      },
      group: 'block',
      draggable: true,
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs(dom: Element) {
            return {
              src: dom.getAttribute('src'),
              title: dom.getAttribute('title'),
              alt: dom.getAttribute('alt')
            };
          }
        }
      ],
      toDOM(node) {
        const { src, alt, title } = node.attrs;
        return ['img', { src: staticUrl(src), alt, title }];
      }
    },

    // :: NodeSpec A hard line break, represented in the DOM as `<br>`.
    hard_break: {
      inline: true,
      group: 'inline',
      selectable: false,
      parseDOM: [{ tag: 'br' }],
      toDOM() {
        return ['br'];
      }
    },

    cards: {
      group: 'block',
      atom: false,
      selectable: false,
      defining: true,
      attrs: {
        data: { default: [{ heading: '', body: ''}]}
      }
    },

  },
  marks: {
    // :: MarkSpec A link. Has `href` and `title` attributes. `title`
    // defaults to the empty string. Rendered and parsed as an `<a>`
    // element.
    link: {
      attrs: {
        href: {},
        title: { default: null }
      },
      inclusive: false,
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs(dom: Element) {
            return { href: dom.getAttribute('href'), title: dom.getAttribute('title') };
          }
        }
      ],
      toDOM(node) {
        const { href, title } = node.attrs;
        return ['a', { href, title }, 0];
      }
    },

    // :: MarkSpec An emphasis mark. Rendered as an `<em>` element.
    // Has parse rules that also match `<i>` and `font-style: italic`.
    em: {
      parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
      toDOM() {
        return ['em', 0];
      }
    },

    // :: MarkSpec A strong mark. Rendered as `<strong>`, parse rules
    // also match `<b>` and `font-weight: bold`.
    strong: {
      parseDOM: [
        { tag: 'strong' },
        // This works around a Google Docs misbehavior where
        // pasted content will be inexplicably wrapped in `<b>`
        // tags with a font-weight normal.
        // { tag: 'b', getAttrs: (node) => node.style.fontWeight != 'normal' && null },
        // { style: 'font-weight', getAttrs: (value) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null }
      ],
      toDOM() {
        return ['strong', 0];
      }
    },

    // :: MarkSpec Code font mark. Represented as a `<code>` element.
    code: {
      parseDOM: [{ tag: 'code' }],
      toDOM() {
        return ['code', 0];
      }
    }
  }
 });

export type Schema = typeof schema;
