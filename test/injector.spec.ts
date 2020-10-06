import { expect } from "chai";
import { InjectMetric } from "../src";

describe("InjectMetric", function () {
  it("returns a function", function () {
    const result = InjectMetric("controller");

    expect(result).to.be.a("function");
  });
});
