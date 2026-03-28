import { Test, TestingModule } from "@nestjs/testing";
import * as client from "prom-client";
import { MetricObjectWithValues, MetricValue } from "prom-client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

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
    expect(metric).toBeInstanceOf(client.Histogram);
  });

  it("has the appropriate methods (observe)", function () {
    expect(typeof metric.observe).toBe("function");
  });

  it("should prefix the metric if provided", async function () {
    const metricValues: MetricObjectWithValues<MetricValue<string>> = await metric.get();

    expect(metricValues.name).toBe("app_controller_histogram");
  });
});

describe("Histogram with inject", function () {
  const LATENCY_TOKEN = "LATENCY_SERVICE";

  let testingModule: TestingModule;
  let metric: client.Histogram<string>;

  beforeEach(async function () {
    testingModule = await Test.createTestingModule({
      providers: [
        {
          provide: LATENCY_TOKEN,
          useValue: {
            getLatency: () => 0.5,
          },
        },
        makeHistogramProvider({
          name: "injected_histogram",
          help: "injected_histogram_help",
          inject: [LATENCY_TOKEN],
          collect(service: { getLatency(): number }) {
            const value = service.getLatency();
            this.observe(value);
          },
        }),
      ],
    }).compile();

    metric = testingModule.get(getToken("injected_histogram"));
  });

  afterEach(async function () {
    client.register.clear();
    await testingModule.close();
  });

  it("creates a Histogram", function () {
    expect(metric).toBeInstanceOf(client.Histogram);
  });

  it("passes injected dependencies to collect", async function () {
    const metricValues: MetricObjectWithValues<MetricValue<string>> = await metric.get();

    expect(metricValues.values.length).toBeGreaterThan(0);
  });
});
