import { checkRequiredEnvVars, IS_DEV } from '@mpa/env';
export * from '@mpa/env';
export { default as default } from '@mpa/env';

checkRequiredEnvVars(IS_DEV ? 'DEV_SERVER' : 'SERVER');
