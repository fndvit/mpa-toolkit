import path from 'path';
import * as dotenv from 'dotenv';

const envFile = process.env.TEST ? '.env.test' : '.env';

dotenv.config({ path: path.join(process.cwd(), '../..', envFile) });
