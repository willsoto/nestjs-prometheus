import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import client from "prom-client";

/**
 * @public
 *
 * {@inheritDoc PrometheusOptions.controller}
 */
@Controller()
export class PrometheusController {
  @Get()
  index(@Res() response: Response): void {
    response.header("Content-Type", client.register.contentType);
    response.send(client.register.metrics());
  }
}
