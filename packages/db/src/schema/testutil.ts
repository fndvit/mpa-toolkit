import { expect } from 'vitest';
import ValidationError from 'ajv/dist/runtime/validation_error';
import { validate } from '../validation';

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
  try {
    validate(schema, obj);
    expect.fail(`Expected ${schema} to be invalid, but it was valid.\n${logObj}`);
  } catch (e) {
    if (e instanceof ValidationError) {
      expect(e.errors.length).greaterThanOrEqual(1);
    } else {
      expect.fail(`Expected a ValidationError.\n${logObj}`);
    }
  }
};
