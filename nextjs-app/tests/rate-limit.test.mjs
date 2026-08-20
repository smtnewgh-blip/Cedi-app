import assert from "node:assert/strict";
import test from "node:test";
import { clearRateLimits, takeRateLimit } from "../lib/rate-limit.js";

test("allows requests through the configured limit", () => {
  clearRateLimits();
  assert.equal(takeRateLimit("user", 2, 1_000, 100).allowed, true);
  assert.equal(takeRateLimit("user", 2, 1_000, 200).allowed, true);
  assert.equal(takeRateLimit("user", 2, 1_000, 300).allowed, false);
});

test("resets a rate-limit window", () => {
  clearRateLimits();
  takeRateLimit("user", 1, 1_000, 100);
  assert.equal(takeRateLimit("user", 1, 1_000, 1_100).allowed, true);
});
