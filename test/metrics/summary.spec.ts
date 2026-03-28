import { Test, TestingModule } from "@nestjs/testing";
import * as client from "prom-client";
import { MetricObjectWithValues, MetricValue } from "prom-client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { getToken, makeSummaryProvider } from "../../src";
import { PROMETHEUS_OPTIONS } from "../../src/constants";

describe("Summary", function () {
  let testingModule: TestingModule;
  let metric: client.Summary<string>;

  beforeEach(async function () {
    testingModule = await Test.createTestingModule({
      providers: [
        makeSummaryProvider({
          name: "controller_summary",
          help: "controller_summary_help",
        }),
        {
          provide: PROMETHEUS_OPTIONS,
          useValue: {
            customMetricPrefix: "app",
          },
        },
      ],
    }).compile();

    metric = testingModule.get(getToken("controller_summary"));
  });

  afterEach(async function () {
    await testingModule.close();
  });

  it("creates a Summary", function () {
    expect(metric).toBeInstanceOf(client.Summary);
  });

  it("has the appropriate methods (observe)", function () {
    expect(typeof metric.observe).toBe("function");
  });

  it("should prefix the metric if provided", async function () {
    const metricValues: MetricObjectWithValues<MetricValue<string>> = await metric.get();

    expect(metricValues.name).toBe("app_controller_summary");
  });
});

describe("Summary with inject", function () {
  const DURATION_TOKEN = "DURATION_SERVICE";

  let testingModule: TestingModule;
  let metric: client.Summary<string>;

  beforeEach(async function () {
    testingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DURATION_TOKEN,
          useValue: {
            getDuration: () => 0.25,
          },
        },
        makeSummaryProvider({
          name: "injected_summary",
          help: "injected_summary_help",
          inject: [DURATION_TOKEN],
          collect(service: { getDuration(): number }) {
            const value = service.getDuration();
            this.observe(value);
          },
        }),
      ],
    }).compile();

    metric = testingModule.get(getToken("injected_summary"));
  });

  afterEach(async function () {
    client.register.clear();
    await testingModule.close();
  });

  it("creates a Summary", function () {
    expect(metric).toBeInstanceOf(client.Summary);
  });

  it("passes injected dependencies to collect", async function () {
    const metricValues: MetricObjectWithValues<MetricValue<string>> = await metric.get();

    expect(metricValues.values.length).toBeGreaterThan(0);
  });
});
