import path from 'path';

export const getPath = (dir: string) => path.join(process.cwd(), dir);
