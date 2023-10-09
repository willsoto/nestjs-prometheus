import { Provider } from "@nestjs/common";
import * as client from "prom-client";
import { PrometheusContentType, RegistryContentType } from "prom-client";
import { PROMETHEUS_OPTIONS } from "../constants";
import { PrometheusOptions } from "../interfaces";
import { getOrCreateMetric, getToken } from "./utils";

/**
 * @public
 */
export function makeGaugeProvider(
  options: client.GaugeConfiguration<string>,
): Provider {
  return {
    provide: getToken(options.name),
    useFactory<T extends RegistryContentType = PrometheusContentType>(
      config?: PrometheusOptions<T>,
    ): client.Metric<string> {
      return getOrCreateMetric("Gauge", options, config);
    },
    inject: [
      {
        token: PROMETHEUS_OPTIONS,
        optional: true,
      },
    ],
  };
}
