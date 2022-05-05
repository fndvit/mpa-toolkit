import { beforeAll, describe, expect, test } from "vitest";
import { validate } from "./validation";
import pageValidChapter from './testdata/page.valid.chapter.json';
import pageValidCaseStudy from './testdata/page.valid.casestudy.json';
import pageInvalidTags from './testdata/page.invalid.tags.json';
import pageInvalidCaseStudies from './testdata/page.invalid.casestudies.json';
import pageInvalidChapters from './testdata/page.invalid.chapters.json';
import pageInvalid from './testdata/page.invalid.json';

describe("Page", () => {

  beforeAll(() => {
    validate.errors = undefined;
  });

  test("valid chapter", () => {
    validate("page", pageValidChapter);
  });

  test("valid casestudy", () => {
    validate("page", pageValidCaseStudy);
  });

  test("empty", () => {
    expect(() => validate("page", {})).toThrowError();
  });

  test("invalid tags", () => {
    pageInvalidTags.forEach(tag => {
      validate.errors = undefined;
      expect(() => validate("page/tag", tag)).toThrowError();
      expect(validate.errors.length).greaterThanOrEqual(1);
    });
  });

  test("invalid case studies", () => {
    pageInvalidCaseStudies.forEach(casestudy => {
      validate.errors = undefined;
      expect(() => validate("page/caseStudy", casestudy)).toThrowError();
      expect(validate.errors.length).greaterThanOrEqual(1);
    });
  });

  test("invalid chapters", () => {
    pageInvalidChapters.forEach(chapter => {
      validate.errors = undefined;
      expect(() => validate("page/chapter", chapter)).toThrowError();
      expect(validate.errors.length).greaterThanOrEqual(1);
    });
  });

  test("invalid pages", () => {
    pageInvalid.forEach(page => {
      validate.errors = undefined;
      expect(() => validate("page", page)).toThrowError();
      expect(validate.errors.length).greaterThanOrEqual(1);
    });
  });

});