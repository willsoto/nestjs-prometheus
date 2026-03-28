import { InjectionToken } from "@nestjs/common/interfaces";
import { OptionalFactoryDependency } from "@nestjs/common/interfaces/modules/optional-factory-dependency.interface";
import * as client from "prom-client";
import { PrometheusContentType, RegistryContentType } from "prom-client";

import { PrometheusOptions } from "../interfaces";

/**
 * @internal
 */
export type Metrics = "Gauge" | "Summary" | "Histogram" | "Counter";

/**
 * @internal
 */
export type Options =
  | client.GaugeConfiguration<string>
  | client.SummaryConfiguration<string>
  | client.CounterConfiguration<string>
  | client.HistogramConfiguration<string>;

/**
 * @internal
 */
export function getOrCreateMetric<T extends RegistryContentType = PrometheusContentType>(
  type: Metrics,
  options: Options,
  prometheusOptions?: PrometheusOptions<T>,
): client.Metric<string> {
  const opts: Options = {
    ...options,
    name: prometheusOptions?.customMetricPrefix
      ? prometheusOptions.customMetricPrefix.concat("_", options.name)
      : options.name,
  };

  const existingMetric = client.register.getSingleMetric(opts.name);
  if (existingMetric) {
    return existingMetric;
  }

  switch (type) {
    case "Gauge":
      return new client.Gauge(opts as client.GaugeConfiguration<string>);
    case "Counter":
      return new client.Counter(opts as client.CounterConfiguration<string>);
    case "Histogram":
      return new client.Histogram(opts as client.HistogramConfiguration<string>);
    case "Summary":
      return new client.Summary(opts as client.SummaryConfiguration<string>);
    default:
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Unknown type: ${type}`);
  }
}

/**
 * @public
 */
export type MetricProviderInject = Array<InjectionToken | OptionalFactoryDependency>;

/**
 * Additional options for metric providers that support dependency injection
 * into the `collect` function.
 *
 * @public
 */
export interface MetricProviderInjectable<T> {
  inject?: MetricProviderInject;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  collect?: (this: T, ...args: any[]) => void | Promise<void>;
}

/**
 * @public
 */
export function getToken(name: string): string {
  return `PROM_METRIC_${name.toUpperCase()}`;
}
