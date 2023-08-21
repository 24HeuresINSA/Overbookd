import { describe, expect, it } from '@jest/globals';
import { ONE_HOUR_IN_MS, ONE_MINUTE_IN_MS } from '@overbookd/period';
import { Duration } from './duration';

describe('duration', () => {
  describe.each`
    hours | minutes | milliseconds | expected
    ${0}  | ${0}    | ${0}         | ${'0h00'}
    ${0}  | ${0}    | ${100}       | ${'0h00'}
    ${0}  | ${5}    | ${0}         | ${'0h05'}
    ${0}  | ${59}   | ${0}         | ${'0h59'}
    ${1}  | ${0}    | ${0}         | ${'1h00'}
    ${25} | ${0}    | ${0}         | ${'25h00'}
  `(
    'when the duration is $hours hours and $minutes minutes and $milliseconds milliseconds',
    ({ hours, minutes, milliseconds, expected }) => {
      it(`should display ${expected}`, () => {
        expect(
          Duration.fromMilliseconds(
            (hours as number) * ONE_HOUR_IN_MS +
              (minutes as number) * ONE_MINUTE_IN_MS +
              (milliseconds as number)
          ).toString()
        ).toBe(expected);
      });
    }
  );
});
