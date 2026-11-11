import assert from "node:assert/strict";
import { test } from "node:test";
import { elapsedSeconds, formatDuration } from "./elapsed.ts";

const shown = (startedAt: number, at: number) => formatDuration(elapsedSeconds(startedAt, at));

test("sub-second spans stay at 00:00 for the clock, the row, and the announcement", () => {
  const startedAt = 1_000_000;
  for (const elapsedMs of [0, 1, 400, 499, 500, 999]) {
    const seconds = elapsedSeconds(startedAt, startedAt + elapsedMs);
    const clock = formatDuration(seconds);
    assert.equal(seconds, 0, `${elapsedMs}ms`);
    assert.equal(clock, "00:00");
    assert.equal(`Writing saved, ${clock}.`, "Writing saved, 00:00.");
    const roundedMinimum = Math.max(1, Math.round(elapsedMs / 1000));
    assert.equal(roundedMinimum, 1);
    assert.notEqual(formatDuration(roundedMinimum), clock);
  }
});

test("the same whole second is shown across a second boundary that rounding would jump", () => {
  const startedAt = 5_000;
  assert.equal(shown(startedAt, startedAt + 1000), "00:01");
  assert.equal(shown(startedAt, startedAt + 1499), "00:01");
  assert.equal(shown(startedAt, startedAt + 1500), "00:01");
  assert.equal(Math.round(1500 / 1000), 2);
  assert.equal(shown(startedAt, startedAt + 2000), "00:02");
  assert.equal(shown(startedAt, startedAt + 61_000), "01:01");
});

test("a clock running backwards or with a bad timestamp stays at zero", () => {
  assert.equal(elapsedSeconds(2_000, 1_500), 0);
  assert.equal(formatDuration(elapsedSeconds(Number.NaN, 1_000)), "00:00");
});
