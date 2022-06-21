import { beforeAll, describe, expect, test } from "vitest";
import { validate } from "./validation";
import tagValid from "./testdata/tag.valid.json";
import tagInvalid from "./testdata/tag.invalid.json";

describe("Page", () => {

  beforeAll(() => {
    validate.errors = undefined;
  });

  test("empty", () => {
    expect(() => validate("tag", {})).toThrowError();
  });

  test("invalid", () => {
    tagInvalid.forEach(tag => {
      validate.errors = undefined;
      expect(() => validate("tag", tag)).toThrowError();
      expect(validate.errors.length).greaterThanOrEqual(1);
    });
  });

  test("valid", () => {
    tagValid.forEach(tag => {
      validate("tag", tag);
    });
  });

});
