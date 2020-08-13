import { Test, TestingModule } from "@nestjs/testing";
import { getToken, makeCounterProvider } from "@src";
import { expect } from "chai";
import * as client from "prom-client";

describe("Counter", function () {
  let testingModule: TestingModule;
  let metric: client.Counter<string>;

  beforeEach(async function () {
    testingModule = await Test.createTestingModule({
      providers: [
        makeCounterProvider({
          name: "controller_counter",
          help: "controller_counter_help",
        }),
      ],
    }).compile();

    metric = testingModule.get(getToken("controller_counter"));
  });

  afterEach(async function () {
    await testingModule.close();
  });

  it("creates a Counter", function () {
    expect(metric).to.be.instanceOf(client.Counter);
  });

  it("has the appropriate methods (inc)", function () {
    expect(metric.inc).to.be.a("function");
  });
});
