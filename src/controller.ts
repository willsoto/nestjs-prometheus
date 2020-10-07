import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import client from "prom-client";

/**
 * PrometheusController is used to expose the Prometheus metrics via http
 *
 * @public
 */
@Controller()
export class PrometheusController {
  @Get()
  index(@Res() response: Response): void {
    response.header("Content-Type", client.register.contentType);
    response.send(client.register.metrics());
  }
}
