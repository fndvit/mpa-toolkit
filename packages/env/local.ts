import path from 'path';
import * as dotenv from 'dotenv';

const envFile = process.env.TEST ? '.env.test' : '.env';

console.log('loading env from', envFile);
dotenv.config({ path: path.join(process.cwd(), '../..', envFile) });
