import { expect } from "chai";
import { register } from "prom-client";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Test } from "@nestjs/testing";
import { PrometheusModule } from "@src";

describe("PrometheusModuleWithFastify", () => {
  let app: NestFastifyApplication;

  afterEach(async () => {
    if (app) {
      register.clear();
      await app.close();
    }
  });

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [PrometheusModule.register()],
    }).compile();

    app = testingModule.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
  });

  it("registers a /metrics endpoint", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/metrics",
    });

    expect(response).to.have.property("statusCode").to.eql(200);
  });
});
