import { beforeAll, describe, expect, test } from "vitest";
import { validate } from "./validation";
import userValid from "./testdata/user.valid.json";
import userInvalid from "./testdata/user.invalid.json";

describe("User", () => {

  beforeAll(() => {
    validate.errors = undefined;
  });

  test("empty", () => {
    expect(() => validate("user", {})).toThrowError();
  });

  test("invalid", () => {
    userInvalid.forEach(user => {
      validate.errors = undefined;
      expect(() => validate("user", user)).toThrowError();
      expect(validate.errors.length).greaterThanOrEqual(1);
    });
  });

  test("valid", () => {
    userValid.forEach(user => {
      validate("user", user);
    });
  });

});
