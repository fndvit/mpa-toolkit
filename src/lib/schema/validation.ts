import Ajv from "ajv";
import type { AnyValidateFunction } from "ajv/dist/core";
import * as schemaPage from "./page.json";

export const ajv = new Ajv();

ajv.addSchema(schemaPage);

interface Validate {
  (schema: string, data: any): void;
  errors?: AnyValidateFunction<unknown>['errors'];
}

export const validate: Validate = (schema: string, data: unknown) => {
  const _validate = ajv.getSchema(schema);
  const valid = _validate(data);
  if (!valid) {
    validate.errors = _validate.errors;
    throw new Error(_validate.errors.map(e => e.message).join(', '));
  }
};
