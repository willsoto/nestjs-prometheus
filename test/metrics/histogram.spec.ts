import { Test, TestingModule } from "@nestjs/testing";
import { getToken, makeHistogramProvider } from "@src";
import { expect } from "chai";
import * as client from "prom-client";

describe("Histogram", function() {
  let testingModule: TestingModule;
  let metric: client.Histogram;

  beforeEach(async function() {
    testingModule = await Test.createTestingModule({
      providers: [
        makeHistogramProvider({
          name: "controller_histogram",
          help: "controller_histogram_help",
        }),
      ],
    }).compile();

    metric = testingModule.get(getToken("controller_histogram"));
  });

  afterEach(async function() {
    await testingModule.close();
  });

  it("creates a Histogram", function() {
    expect(metric).to.be.instanceOf(client.Histogram);
  });

  it("has the appropriate methods (observe)", function() {
    expect(metric.observe).to.be.a("function");
  });
});
