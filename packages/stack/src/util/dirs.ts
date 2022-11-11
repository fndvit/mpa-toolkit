import path from 'path';

export const PROJECT_ROOT = path.join(process.cwd(), '../..');
export const getPath = (_path: string) => path.join(PROJECT_ROOT, _path);
export const getLambdaPath = (dir: string) => path.join(getPath('packages/stack/src/lambda'), dir);
