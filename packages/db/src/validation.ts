import Ajv from 'ajv';
import type { AnyValidateFunction, ErrorObject } from 'ajv/dist/core';
import * as schemaPage from './schema/page.json';
import * as schemaUser from './schema/user.json';
import * as schemaTag from './schema/tag.json';
import * as schemaAuthor from './schema/author.json';
import * as schemaHomepageComponents from './schema/homepage-components.json';

export const ajv = new Ajv({ removeAdditional: true });

// const log = logger.child({ scope: 'validate' });

ajv.addSchema(schemaPage);
ajv.addSchema(schemaUser);
ajv.addSchema(schemaTag);
ajv.addSchema(schemaAuthor);
ajv.addSchema(schemaHomepageComponents);

interface Validate {
  (schema: string, data: unknown): void;
  errors?: AnyValidateFunction<unknown>['errors'];
}

class ValidationError {
  errors: ErrorObject[];
  data: unknown;

  constructor(data: unknown, errors: ErrorObject[]) {
    this.data = data;
    this.errors = errors;
  }

  toString = () => this.errors.map(e => e.message).join('\n');
}

export const validate: Validate = (schema: string, data: unknown) => {
  const _validate = ajv.getSchema(schema);
  if (!_validate) throw new Error(`Schema not found: ${schema}`);
  const valid = _validate(data);
  if (!valid) {
    throw new ValidationError(data, _validate.errors || []);
  }
};
