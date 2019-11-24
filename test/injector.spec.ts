import { InjectMetric } from "@src";
import { expect } from "chai";

describe("InjectMetric", function() {
  it("returns a function", function() {
    const result = InjectMetric("controller");

    expect(result).to.be.a("function");
  });
});
