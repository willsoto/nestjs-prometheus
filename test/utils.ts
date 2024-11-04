import { INestApplication } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import {
  PrometheusAsyncOptions,
  PrometheusModule,
  PrometheusOptions,
} from "../src";
// eslint-disable-next-line @typescript-eslint/no-require-imports
import TestAgent = require("supertest/lib/agent");

export type Agent = TestAgent<request.Test>;
export type App = INestApplication;

export interface TestHarness {
  testingModule: TestingModule;
  app: App;
  agent: Agent;
}

export async function createPrometheusModule(
  options?: PrometheusOptions,
): Promise<TestHarness> {
  const testingModule = await Test.createTestingModule({
    imports: [PrometheusModule.register(options)],
  }).compile();

  const app = testingModule.createNestApplication<NestExpressApplication>();
  await app.init();

  const agent = request(app.getHttpServer());

  return {
    testingModule,
    app,
    agent,
  };
}

export async function createAsyncPrometheusModule(
  options: PrometheusAsyncOptions,
): Promise<TestHarness> {
  const testingModule = await Test.createTestingModule({
    imports: [PrometheusModule.registerAsync(options)],
  }).compile();

  const app = testingModule.createNestApplication<NestExpressApplication>();
  await app.init();

  const agent = request(app.getHttpServer());

  return {
    testingModule,
    app,
    agent,
  };
}
