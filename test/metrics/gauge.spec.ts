import { Test, TestingModule } from "@nestjs/testing";
import * as client from "prom-client";
import { MetricObjectWithValues, MetricValue } from "prom-client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
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
    client.register.clear();
    await testingModule.close();
  });

  it("creates a Gauge", function () {
    expect(metric).toBeInstanceOf(client.Gauge);
  });

  it("has the appropriate methods (inc)", function () {
    expect(typeof metric.inc).toBe("function");
  });

  it("has the appropriate methods (dec)", function () {
    expect(typeof metric.dec).toBe("function");
  });

  it("should prefix the metric if provided", async function () {
    const metricValues: MetricObjectWithValues<MetricValue<string>> =
      await metric.get();

    expect(metricValues.name).toBe("app_controller_gauge");
  });
});

describe("Gauge with inject", function () {
  const QUEUE_TOKEN = "QUEUE_SERVICE";

  let testingModule: TestingModule;
  let metric: client.Gauge<string>;

  beforeEach(async function () {
    testingModule = await Test.createTestingModule({
      providers: [
        {
          provide: QUEUE_TOKEN,
          useValue: {
            getWaitingCount: () => 42,
          },
        },
        makeGaugeProvider({
          name: "queue_size",
          help: "queue_size_help",
          inject: [QUEUE_TOKEN],
          collect(queue: { getWaitingCount(): number }) {
            const value = queue.getWaitingCount();
            this.set(value);
          },
        }),
      ],
    }).compile();

    metric = testingModule.get(getToken("queue_size"));
  });

  afterEach(async function () {
    client.register.clear();
    await testingModule.close();
  });

  it("creates a Gauge", function () {
    expect(metric).toBeInstanceOf(client.Gauge);
  });

  it("passes injected dependencies to collect", async function () {
    const metricValues: MetricObjectWithValues<MetricValue<string>> =
      await metric.get();

    expect(metricValues.values).toHaveLength(1);
    expect(metricValues.values[0].value).toBe(42);
  });
});
