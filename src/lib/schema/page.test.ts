import { beforeAll, describe, expect, test } from "vitest";
import { ajv, validate } from "./validation";
import pageValidChapter from './testdata/page.valid.chapter.json';
import pageValidCaseStudy from './testdata/page.valid.casestudy.json';
import pageInvalidTags from './testdata/page.invalid.tags.json';
import pageInvalidCaseStudies from './testdata/page.invalid.casestudies.json';
import pageInvalidChapters from './testdata/page.invalid.chapters.json';
import pageInvalid from './testdata/page.invalid.json';
import pageInvalidMilestones from './testdata/page.invalid.milestones.json';
import pageInvalidKeyLearnings from './testdata/page.invalid.keylearnings.json';

describe("Page", () => {

  beforeAll(() => {
    validate.errors = undefined;
  });

  test("schemas exist", () => {
    expect(ajv.getSchema('page')).toBeTruthy();
    expect(ajv.getSchema('page#/$defs/chapter')).toBeTruthy();
    expect(ajv.getSchema('page#/$defs/caseStudy')).toBeTruthy();
    expect(ajv.getSchema('page#/$defs/tag')).toBeTruthy();
    expect(ajv.getSchema('page#/$defs/milestones')).toBeTruthy();
    expect(ajv.getSchema('page#/$defs/keyLearnings')).toBeTruthy();
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
      expect(() => validate("page#/$defs/tag", tag)).toThrowError();
      expect(validate.errors.length).greaterThanOrEqual(1);
    });
  });

  test("invalid case studies", () => {
    pageInvalidCaseStudies.forEach(casestudy => {
      validate.errors = undefined;
      expect(() => validate("page#/$defs/caseStudy", casestudy)).toThrowError();
      expect(validate.errors.length).greaterThanOrEqual(1);
    });
  });

  test("invalid chapters", () => {
    pageInvalidChapters.forEach(chapter => {
      validate.errors = undefined;
      expect(() => validate("page#/$defs/chapter", chapter)).toThrowError();
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

  test("invalid milestones", () => {
    pageInvalidMilestones.forEach(milestones => {
      validate.errors = undefined;
      expect(() => validate("page#/$defs/milestones", milestones)).toThrowError();
      expect(validate.errors?.length).greaterThanOrEqual(1);
    });
  });

  test("invalid key learnings", () => {
    pageInvalidKeyLearnings.forEach(keylearning => {
      validate.errors = undefined;
      expect(() => validate("page#/$defs/keyLearnings", keylearning)).toThrowError();
      expect(validate.errors?.length).greaterThanOrEqual(1);
    });
  });

});
