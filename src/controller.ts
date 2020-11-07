/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Controller, Get, Res } from "@nestjs/common";
import client from "prom-client";

/**
 * @public
 *
 * {@inheritDoc PrometheusOptions.controller}
 */
@Controller()
export class PrometheusController {
  @Get()
  index(@Res() response: unknown): void {
    // See this issue for why we type this as `unknown`
    // https://github.com/willsoto/nestjs-prometheus/issues/530
    // I currently don't know of any type from NestJS that captures the
    // union of all available responses and I don't want to force users to
    // download types for a framework they aren't using.
    // @ts-expect-error
    response.header("Content-Type", client.register.contentType);
    // @ts-expect-error
    response.send(client.register.metrics());
  }
}
