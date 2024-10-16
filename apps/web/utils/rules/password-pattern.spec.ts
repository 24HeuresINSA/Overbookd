import { describe, expect, it } from "vitest";
import { passwordPattern } from "./input.rules";

describe.each`
  password                                          | isValid  | description
  ${"ValidPassw0rd!"}                               | ${true}  | ${"valid password with required characters"}
  ${"Short1!"}                                      | ${false} | ${"password less than 12 characters"}
  ${"validpassword1!"}                              | ${false} | ${"password with no uppercase letter"}
  ${"INVALIDPASSWORD1!"}                            | ${false} | ${"password with no lowercase letter"}
  ${"InvalidPassword!"}                             | ${false} | ${"password with no number"}
  ${"InvalidPassword1"}                             | ${false} | ${"password with no special character"}
  ${"ComplexP@ssw0rd!?"}                            | ${true}  | ${"password with multiple special characters"}
  ${"AcomplexP@ssw0rd!#$%^&*+=_.,;:?{}\\/\\-|\\()"} | ${true}  | ${"password with all special characters from the list"}
`("Password pattern tests", ({ password, isValid, description }) => {
  it(`should return ${isValid} for a ${description}`, () => {
    expect(passwordPattern.test(password)).toBe(isValid);
  });
});
