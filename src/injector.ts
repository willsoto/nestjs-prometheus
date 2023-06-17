import { Inject } from "@nestjs/common";
import { getToken } from "./metrics";

/**
 * Used to inject the registered metric via the given token
 *
 * @public
 *
 * @example
 * Assuming you have registered a metric with the name `metric_name`, you would inject it
 * like so:
 * ```
 * import { Injectable } from "@nestjs/common";
 * import { Counter } from "prom-client";
 * import { InjectMetric } from "@willsoto/nestjs-prometheus";
 *
 * @Injectable()
 * export class Service {
 *   constructor(@InjectMetric("metric_name") public counter: Counter<string>) {}
 * }
 * ```
 */
export function InjectMetric(name: string) {
  return Inject(getToken(name));
}
