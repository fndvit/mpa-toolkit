import * as path from 'path';
import shell from 'shelljs';

export default function projectRoot(...args: string[]) {
  return path.resolve(shell.exec('pnpm -w root', { silent: true }).toString(), '..', ...args);
}
