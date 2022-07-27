import compression from "@fastify/compress";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Test } from "@nestjs/testing";
import { expect } from "chai";
import { afterEach, beforeEach } from "mocha";
import { register } from "prom-client";
import { PrometheusModule } from "../src";

describe("Fastify integration", () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [PrometheusModule.register()],
    }).compile();

    app = testingModule.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
  });

  afterEach(async () => {
    register.clear();
    await app.close();
  });

  describe("without compression", function () {
    beforeEach(async () => {
      await app.init();
    });

    it("registers a /metrics endpoint", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/metrics",
      });

      expect(response).to.have.property("statusCode").to.eql(200);
      expect(response.body).to.be.a("string");
    });
  });

  describe("with compression", function () {
    beforeEach(async () => {
      await app.register(compression);
      await app.init();
    });

    it("registers a /metrics endpoint", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/metrics",
      });

      expect(response).to.have.property("statusCode").to.eql(200);
      expect(response.body).to.be.a("string");
    });
  });
});
