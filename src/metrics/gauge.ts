import { Provider } from "@nestjs/common";
import * as client from "prom-client";
import { PrometheusContentType, RegistryContentType } from "prom-client";

import { PROMETHEUS_OPTIONS } from "../constants";
import { PrometheusOptions } from "../interfaces";
import { MetricProviderInjectable, getOrCreateMetric, getToken } from "./utils";

/**
 * @public
 */
export function makeGaugeProvider(
  options: Omit<client.GaugeConfiguration<string>, "collect"> &
    MetricProviderInjectable<client.Gauge<string>>,
): Provider {
  const { inject: extraInject = [], collect, ...restOptions } = options;

  return {
    provide: getToken(restOptions.name),
    useFactory<T extends RegistryContentType = PrometheusContentType>(
      config?: PrometheusOptions<T>,
      ...injectedDeps: unknown[]
    ): client.Metric<string> {
      const metricOptions: client.GaugeConfiguration<string> = collect
        ? {
            ...restOptions,
            collect(this: client.Gauge<string>) {
              return collect.call(this, ...injectedDeps);
            },
          }
        : restOptions;
      return getOrCreateMetric("Gauge", metricOptions, config);
    },
    inject: [
      {
        token: PROMETHEUS_OPTIONS,
        optional: true,
      },
      ...extraInject,
    ],
  };
}
