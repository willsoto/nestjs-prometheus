import { Injectable } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { expect } from "chai";
import * as client from "prom-client";
import {
  Counter,
  MetricObjectWithValues,
  MetricValue,
  register,
} from "prom-client";
import {
  InjectMetric,
  PrometheusModule,
  getToken,
  makeCounterProvider,
} from "../../src";

describe("Counter", function () {
  let testingModule: TestingModule;
  let metric: client.Counter<string>;

  @Injectable()
  class MyService {
    constructor(
      @InjectMetric("controller_counter") public counter: Counter<string>,
    ) {}
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
    expect(metric).to.be.instanceOf(client.Counter);
  });

  it("has the appropriate methods (inc)", function () {
    expect(metric.inc).to.be.a("function");
  });

  it("should be injectable into the service", function () {
    expect(testingModule.get(MyService)).to.be.instanceOf(MyService);

    const service = testingModule.get(MyService);

    expect(service.counter).to.be.instanceOf(Counter);
  });

  it(`name has no prefix besides "controller_counter"`, async function () {
    const metricValues: MetricObjectWithValues<MetricValue<string>> =
      await metric.get();
    expect(metricValues.name).to.equal("controller_counter");
  });
});
