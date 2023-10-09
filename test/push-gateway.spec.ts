import { Injectable, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { expect } from "chai";
import { PrometheusContentType, Pushgateway, register } from "prom-client";
import {
  PrometheusModule,
  PrometheusOptions,
  PrometheusOptionsFactory,
} from "../src";
import { createAsyncPrometheusModule, createPrometheusModule } from "./utils";

describe("Pushgateway", function () {
  @Injectable()
  class OptionsService implements PrometheusOptionsFactory {
    createPrometheusOptions(): PrometheusOptions | Promise<PrometheusOptions> {
      return {
        pushgateway: {
          url: "http://127.0.0.1:9091",
        },
      };
    }
  }

  @Injectable()
  class MockService {
    constructor(
      public readonly pushgateway: Pushgateway<PrometheusContentType>,
    ) {}
  }

  @Module({
    providers: [OptionsService],
    exports: [OptionsService],
  })
  class OptionsModule {}

  afterEach(function () {
    register.clear();
  });

  it("should register a pushgateway if options are provided (sync)", async function () {
    const { testingModule, app } = await createPrometheusModule({
      pushgateway: {
        url: "http://127.0.0.1:9091",
      },
    });
    const gateway = testingModule.get(Pushgateway);

    expect(gateway).to.be.instanceOf(Pushgateway);

    await app.close();
  });

  it("should register a pushgateway if options are provided (async)", async function () {
    const { testingModule, app } = await createAsyncPrometheusModule({
      imports: [OptionsModule],
      useExisting: OptionsService,
      inject: [OptionsService],
    });
    const gateway = testingModule.get(Pushgateway);

    expect(gateway).to.be.instanceOf(Pushgateway);

    await app.close();
  });

  it("should be injected in another provider for sync", async function () {
    const moduleRef = await Test.createTestingModule({
      imports: [
        PrometheusModule.register({
          pushgateway: {
            url: "http://127.0.0.1:9091",
          },
        }),
      ],
      providers: [MockService],
    }).compile();

    const mockService = moduleRef.get<MockService>(MockService);

    expect(mockService.pushgateway).to.be.an.instanceOf(Pushgateway);
    expect(mockService.pushgateway).to.have.property(
      "gatewayUrl",
      "http://127.0.0.1:9091",
    );
  });

  it("should be injected in another provider for async", async function () {
    const moduleRef = await Test.createTestingModule({
      imports: [
        PrometheusModule.registerAsync({
          useClass: OptionsService,
        }),
      ],
      providers: [MockService],
    }).compile();

    const mockService = moduleRef.get<MockService>(MockService);

    expect(mockService.pushgateway).to.be.an.instanceOf(Pushgateway);
    expect(mockService.pushgateway).to.have.property(
      "gatewayUrl",
      "http://127.0.0.1:9091",
    );
  });
});
