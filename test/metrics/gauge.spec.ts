import { Test, TestingModule } from "@nestjs/testing";
import { expect } from "chai";
import * as client from "prom-client";
import { MetricObjectWithValues, MetricValue } from "prom-client";
import { getToken, makeGaugeProvider } from "../../src";
import { PROMETHEUS_OPTIONS } from "../../src/constants";

describe("Gauge", function () {
  let testingModule: TestingModule;
  let metric: client.Gauge<string>;

  beforeEach(async function () {
    testingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PROMETHEUS_OPTIONS,
          useValue: {
            customMetricPrefix: "app",
          },
        },
        makeGaugeProvider({
          name: "controller_gauge",
          help: "controller_gauge_help",
        }),
      ],
    }).compile();

    metric = testingModule.get(getToken("controller_gauge"));
  });

  afterEach(async function () {
    await testingModule.close();
  });

  it("creates a Gauge", function () {
    expect(metric).to.be.instanceOf(client.Gauge);
  });

  it("has the appropriate methods (inc)", function () {
    expect(metric.inc).to.be.a("function");
  });

  it("has the appropriate methods (dec)", function () {
    expect(metric.dec).to.be.a("function");
  });

  it("should prefix the metric if provided", async function () {
    const metricValues: MetricObjectWithValues<MetricValue<string>> =
      await metric.get();

    expect(metricValues.name).to.eq("app_controller_gauge");
  });
});
