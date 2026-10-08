import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluate, format } from "./calc.js";

const calc = (s) => format(evaluate(s));

test("basic arithmetic", () => {
  assert.equal(calc("1 + 2"), "3");
  assert.equal(calc("7 - 10"), "-3");
  assert.equal(calc("6 * 7"), "42");
  assert.equal(calc("9 / 4"), "2.25");
  assert.equal(calc("10 % 3"), "1");
});

test("precedence and parentheses", () => {
  assert.equal(calc("2 + 3 * 4"), "14");
  assert.equal(calc("(2 + 3) * 4"), "20");
  assert.equal(calc("2 ^ 3 ^ 2"), "512"); // right-assoc
  assert.equal(calc("-2 ^ 2"), "-4");
  assert.equal(calc("2 * -3"), "-6");
});

test("decimals and float noise", () => {
  assert.equal(calc("0.1 + 0.2"), "0.3");
  assert.equal(calc(".5 * 4"), "2");
});

test("display symbols", () => {
  assert.equal(calc("8 × 2 ÷ 4 − 1"), "3");
});

test("errors", () => {
  assert.throws(() => calc("1 / 0"), /Division by zero/);
  assert.throws(() => calc("1 +"), /Unexpected end/);
  assert.throws(() => calc("(1 + 2"), /Expected '\)'/);
  assert.throws(() => calc("2 $ 3"), /Invalid character/);
  assert.throws(() => calc(""), /Empty/);
  assert.throws(() => calc("1 2"), /Unexpected/);
});
