import { validate } from "./validation";
import { expect } from "vitest";

export const logValidationError = (obj: unknown) => {
  const logObj = {
    obj,
    errors: validate.errors
  };
  return JSON.stringify(logObj);
};

export const schemaExpectValid = (schema: string, obj: unknown) => {
  validate.errors = undefined;
  expect(() => validate(schema, obj), logValidationError(obj)).not.toThrowError();
};

export const schemaExpectInvalid = (schema: string, obj: unknown) => {
  validate.errors = undefined;
  const logObj = JSON.stringify(obj);
  expect(() => validate(schema, obj), `${logObj} no error`).toThrowError();
  expect(validate.errors?.length, logObj).greaterThanOrEqual(1);
};
