import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import {
  PrometheusAsyncOptions,
  PrometheusModule,
  PrometheusOptions,
} from "../src";

export type Agent = request.SuperTest<request.Test>;
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

  const app = testingModule.createNestApplication();
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

  const app = testingModule.createNestApplication();
  await app.init();

  const agent = request(app.getHttpServer());

  return {
    testingModule,
    app,
    agent,
  };
}
