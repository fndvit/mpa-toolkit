import { MpaDatabase } from '@mpa/db';
import env from '$lib/env';

export const db = new MpaDatabase(env.DATABASE_URL);
