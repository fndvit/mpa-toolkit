import {
  chainCommands,
  exitCode,
  joinDown,
  joinUp,
  lift,
  selectParentNode,
  setBlockType,
  toggleMark,
  wrapIn
} from 'prosemirror-commands';
import { redo, undo } from 'prosemirror-history';
import { undoInputRule } from 'prosemirror-inputrules';
import { keymap } from 'prosemirror-keymap';
import type { Schema } from 'prosemirror-model';
import { liftListItem, sinkListItem, splitListItem, wrapInList } from 'prosemirror-schema-list';
import type { Command } from 'prosemirror-state';

type KeyCommand = { name: string; key: string; cmd: Command };

const createKeyMapConfiguration = (schema: Schema) => {
  const keyMap: KeyCommand[] = [];
  const names = new Set<string>();

  const addKey = (name: string, key: string, cmd: Command, swallow = false) => {
    names.add(name);
    const _cmd = swallow ? chainCommands(cmd, () => true) : cmd;
    keyMap.push({ name, key, cmd: _cmd });
  };

  // **********************
  // *      Control       *
  // **********************

  addKey('undo', 'Mod-z', undo);
  addKey('undoInputRule', 'Backspace', undoInputRule);
  addKey('redo', 'Shift-Mod-z', redo);
  addKey('redo', 'Mod-y', redo);

  addKey('joinUp', 'Alt-ArrowUp', joinUp);
  addKey('joinDown', 'Alt-ArrowDown', joinDown);
  addKey('lift', 'Mod-BracketLeft', lift);
  addKey('selectParentNode', 'Escape', selectParentNode);

  // **********************
  // *       Blocks       *
  // **********************

  addKey('setBlockTypeParagraph', 'Shift-Ctrl-0', setBlockType(schema.nodes.paragraph));
  for (let i = 1; i <= 6; i++) {
    addKey(`setHeading${i}`, `Shift-Ctrl-${i}`, setBlockType(schema.nodes.heading, { level: i }));
  }

  // **********************
  // *     Formatting     *
  // **********************

  addKey('toggleMarkStrong', 'Mod-b', toggleMark(schema.marks.strong));
  addKey('toggleMarkStrong', 'Mod-B', toggleMark(schema.marks.strong));
  addKey('toggleMarkEm', 'Mod-i', toggleMark(schema.marks.em));
  addKey('toggleMarkEm', 'Mod-I', toggleMark(schema.marks.em));

  // **********************
  // *       Lists        *
  // **********************

  addKey('sinkListItem', 'Tab', sinkListItem(schema.nodes.list_item), true);
  addKey('liftListItem', 'Shift-Tab', liftListItem(schema.nodes.list_item), true);
  addKey('liftListItem', 'Mod-[', liftListItem(schema.nodes.list_item));
  addKey('sinkListItem', 'Mod-]', sinkListItem(schema.nodes.list_item));
  addKey('splitListItem', 'Enter', splitListItem(schema.nodes.list_item));
  addKey('wrapInListUnordered', 'Shift-Ctrl-8', wrapInList(schema.nodes.bullet_list));
  addKey('wrapInListOrdered', 'Shift-Ctrl-9', wrapInList(schema.nodes.ordered_list));

  // **********************
  // *       Unused?      *
  // **********************

  if (schema.marks.code) addKey('toggleMarkCode', 'Mod-`', toggleMark(schema.marks.code));
  if (schema.nodes.code_block) addKey('setBlockTypeCode', 'Shift-Ctrl-\\', setBlockType(schema.nodes.code_block));
  if (schema.nodes.blockquote) addKey('wrapInBlockquote', 'Ctrl->', wrapIn(schema.nodes.blockquote));
  if (schema.nodes.hard_break) {
    const br = schema.nodes.hard_break;
    const cmd = chainCommands(exitCode, (state, dispatch) => {
      dispatch(state.tr.replaceSelectionWith(br.create()).scrollIntoView());
      return true;
    });

    addKey('hardBreak', 'Cmd-Enter', cmd);
    addKey('hardBreak', 'Ctrl-Enter', cmd);
    addKey('hardBreak', 'Shift-Enter', cmd);
  }

  if (schema.nodes.horizontal_rule) {
    addKey('insertHorizontalRuler', 'Mod-_', (state, dispatch) => {
      const hr = schema.nodes.horizontal_rule;
      dispatch(state.tr.replaceSelectionWith(hr.create()).scrollIntoView());
      return true;
    });
  }

  return keyMap;
};

const getKeyMapFromConfig = (keyMap: KeyCommand[]) => {
  const bindings = keyMap.reduce((acc, { key, cmd }) => {
    acc[key] = cmd;
    return acc;
  }, {} as { [key: string]: Command });
  return keymap(bindings);
};

export const richTextKeyMapPlugin = (schema: Schema) => {
  return getKeyMapFromConfig(createKeyMapConfiguration(schema));
};
