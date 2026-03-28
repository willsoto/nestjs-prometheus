import { describe, expect, it } from "vitest";

import { InjectMetric } from "../src";

describe("InjectMetric", function () {
  it("returns a function", function () {
    const result = InjectMetric("controller");

    expect(typeof result).toBe("function");
  });
});
