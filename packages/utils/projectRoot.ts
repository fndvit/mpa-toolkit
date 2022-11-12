import * as path from 'path';
import shell from 'shelljs';

export default async function projectRoot() {
  return path.resolve(shell.exec('pnpm -w root', { silent: true }).toString(), '..');
}
