import { Injectable } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as client from "prom-client";
import { Counter, MetricObjectWithValues, MetricValue, register } from "prom-client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { InjectMetric, PrometheusModule, getToken, makeCounterProvider } from "../../src";
import { getOrCreateMetric, type Metrics } from "../../src/metrics/utils";

describe("Counter", function () {
  let testingModule: TestingModule;
  let metric: client.Counter<string>;

  @Injectable()
  class MyService {
    constructor(@InjectMetric("controller_counter") public counter: Counter<string>) {}
  }

  beforeEach(async function () {
    testingModule = await Test.createTestingModule({
      imports: [PrometheusModule.register()],
      providers: [
        MyService,
        makeCounterProvider({
          name: "controller_counter",
          help: "controller_counter_help",
        }),
      ],
    }).compile();

    metric = testingModule.get(getToken("controller_counter"));
  });

  afterEach(async function () {
    register.clear();
    await testingModule.close();
  });

  it("creates a Counter", function () {
    expect(metric).toBeInstanceOf(client.Counter);
  });

  it("has the appropriate methods (inc)", function () {
    expect(typeof metric.inc).toBe("function");
  });

  it("should be injectable into the service", function () {
    expect(testingModule.get(MyService)).toBeInstanceOf(MyService);

    const service = testingModule.get(MyService);

    expect(service.counter).toBeInstanceOf(Counter);
  });

  it("should not prefix the metric if not provided", async function () {
    const metricValues: MetricObjectWithValues<MetricValue<string>> = await metric.get();
    expect(metricValues.name).toBe("controller_counter");
  });
});

describe("Counter with inject", function () {
  const COUNT_TOKEN = "COUNT_SERVICE";

  let testingModule: TestingModule;
  let metric: client.Counter<string>;

  beforeEach(async function () {
    testingModule = await Test.createTestingModule({
      providers: [
        {
          provide: COUNT_TOKEN,
          useValue: {
            getCount: () => 5,
          },
        },
        makeCounterProvider({
          name: "injected_counter",
          help: "injected_counter_help",
          inject: [COUNT_TOKEN],
          collect(service: { getCount(): number }) {
            const value = service.getCount();
            this.inc(value);
          },
        }),
      ],
    }).compile();

    metric = testingModule.get(getToken("injected_counter"));
  });

  afterEach(async function () {
    register.clear();
    await testingModule.close();
  });

  it("creates a Counter", function () {
    expect(metric).toBeInstanceOf(client.Counter);
  });

  it("passes injected dependencies to collect", async function () {
    const metricValues: MetricObjectWithValues<MetricValue<string>> = await metric.get();

    expect(metricValues.values).toHaveLength(1);
    expect(metricValues.values[0].value).toBe(5);
  });
});

describe("getOrCreateMetric", function () {
  afterEach(function () {
    register.clear();
  });

  it("throws an error for an unknown metric type", function () {
    expect(() => {
      getOrCreateMetric("Unknown" as Metrics, {
        name: "test",
        help: "test_help",
      });
    }).toThrow("Unknown type: Unknown");
  });
});
