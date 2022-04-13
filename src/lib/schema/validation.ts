import Ajv from "ajv";
import * as schemaPage from "./page.json";

export const ajv = new Ajv();

ajv.addSchema(schemaPage, "page");

type Schemas = 'page';

export const validate = (schema: Schemas, data: unknown) => {
  const _validate = ajv.getSchema(schema);
  const valid = _validate(data);
  if (!valid) {
    throw new Error(_validate.errors.map(e => e.message).join(', '));
  }
};
