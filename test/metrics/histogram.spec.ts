import { Test, TestingModule } from "@nestjs/testing";
import { expect } from "chai";
import * as client from "prom-client";
import { MetricObjectWithValues, MetricValue } from "prom-client";
import { getToken, makeHistogramProvider } from "../../src";
import { PROMETHEUS_OPTIONS } from "../../src/constants";

describe("Histogram", function () {
  let testingModule: TestingModule;
  let metric: client.Histogram<string>;

  beforeEach(async function () {
    testingModule = await Test.createTestingModule({
      providers: [
        makeHistogramProvider({
          name: "controller_histogram",
          help: "controller_histogram_help",
        }),
        {
          provide: PROMETHEUS_OPTIONS,
          useValue: {
            customMetricPrefix: "app",
          },
        },
      ],
    }).compile();

    metric = testingModule.get(getToken("controller_histogram"));
  });

  afterEach(async function () {
    await testingModule.close();
  });

  it("creates a Histogram", function () {
    expect(metric).to.be.instanceOf(client.Histogram);
  });

  it("has the appropriate methods (observe)", function () {
    expect(metric.observe).to.be.a("function");
  });

  it("should prefix the metric if provided", async function () {
    const metricValues: MetricObjectWithValues<MetricValue<string>> =
      await metric.get();

    expect(metricValues.name).to.eq("app_controller_histogram");
  });
});
