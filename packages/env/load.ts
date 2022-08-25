import path from 'path';
import * as dotenv from 'dotenv';

const IS_LAMBDA = process.env.LAMBDA_TASK_ROOT && process.env.AWS_EXECUTION_ENV;
if (!IS_LAMBDA) {
  dotenv.config({ path: path.join(process.cwd(), '../..', '.env.local') });
}
