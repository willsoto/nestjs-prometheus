import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import * as client from "prom-client";

/**
 * @public
 *
 * {@inheritDoc PrometheusOptions.controller}
 */
@Controller()
export class PrometheusController {
  @Get()
  async index(@Res({ passthrough: true }) response: Response): Promise<string> {
    response.setHeader("Content-Type", client.register.contentType);
    return client.register.metrics();
  }
}
