import { Provider } from "@nestjs/common";
import * as client from "prom-client";
import { PrometheusContentType, RegistryContentType } from "prom-client";
import { PROMETHEUS_OPTIONS } from "../constants";
import { PrometheusOptions } from "../interfaces";
import { MetricProviderInjectable, getOrCreateMetric, getToken } from "./utils";

/**
 * @public
 */
export function makeCounterProvider(
  options: Omit<client.CounterConfiguration<string>, "collect"> &
    MetricProviderInjectable<client.Counter<string>>,
): Provider {
  const { inject: extraInject = [], collect, ...restOptions } = options;

  return {
    provide: getToken(restOptions.name),
    useFactory<T extends RegistryContentType = PrometheusContentType>(
      config?: PrometheusOptions<T>,
      ...injectedDeps: unknown[]
    ): client.Metric<string> {
      const metricOptions: client.CounterConfiguration<string> = collect
        ? {
            ...restOptions,
            collect(this: client.Counter<string>) {
              return collect.call(this, ...injectedDeps);
            },
          }
        : restOptions;
      return getOrCreateMetric("Counter", metricOptions, config);
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
