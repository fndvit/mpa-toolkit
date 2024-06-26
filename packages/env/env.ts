import './local';
import type { Expand, Without } from '@mpa/utils';

type EnvConfig = { [key: string]: boolean };
type ConfigToEnvRequired<C extends EnvConfig> = { [K in keyof C]: C[K] extends true ? string : never };
type ConfigToEnvOptional<C extends EnvConfig> = { [K in keyof C]?: C[K] extends boolean ? string : never };
export type ConfigToEnvClean<C extends EnvConfig> = Expand<
  Without<never, ConfigToEnvRequired<C>> & Without<never, ConfigToEnvOptional<C>>
>;

function validateEnv(env: Record<string, string | undefined>, config: EnvConfig) {
  const required = Object.entries(config)
    .filter(([, value]) => value)
    .map(([key]) => key);

  const optional = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  const missing = {
    required: required.filter(k => !env[k]),
    optional: optional.filter(k => !env[k])
  };

  if (missing.required.length > 0) {
    const msg = `Required env vars missing: ${missing.required.join(', ')}`;
    console.error(msg);
    throw new Error(msg);
  }

  return [...required, ...optional].filter(k => env[k]).reduce((acc, k) => ({ ...acc, [k]: env[k] }), {});
}

export function getEnv<C extends EnvConfig>(config: C) {
  return validateEnv(process.env as Record<string, string>, config) as ConfigToEnvClean<C>;
}
