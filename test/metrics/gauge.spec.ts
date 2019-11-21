import { Test, TestingModule } from "@nestjs/testing";
import { getToken, makeGaugeProvider } from "@src";
import { expect } from "chai";
import * as client from "prom-client";

describe("Gauge", function() {
  let testingModule: TestingModule;
  let metric: client.Gauge;

  beforeEach(async function() {
    testingModule = await Test.createTestingModule({
      providers: [
        makeGaugeProvider({
          name: "controller_gauge",
          help: "controller_gauge_help",
        }),
      ],
    }).compile();

    metric = testingModule.get(getToken("controller_gauge"));
  });

  afterEach(async function() {
    await testingModule.close();
  });

  it("creates a Gauge", function() {
    expect(metric).to.be.instanceOf(client.Gauge);
  });

  it("has the appropriate methods (inc)", function() {
    expect(metric.inc).to.be.a("function");
  });

  it("has the appropriate methods (dec)", function() {
    expect(metric.dec).to.be.a("function");
  });
});
