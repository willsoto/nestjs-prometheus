import * as client from "prom-client";
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
export function getOrCreateMetric(
  type: Metrics,
  options: Options,
  prometheusOptions?: PrometheusOptions,
): client.Metric<string> {
  const existingMetric = client.register.getSingleMetric(options.name);

  if (existingMetric) {
    return existingMetric;
  }

  options.name = prometheusOptions?.prefix
    ? prometheusOptions?.prefix.concat(options.name)
    : options.name;

  switch (type) {
    case "Gauge":
      return new client.Gauge(options as client.GaugeConfiguration<string>);
    case "Counter":
      return new client.Counter(options as client.CounterConfiguration<string>);
    case "Histogram":
      return new client.Histogram(
        options as client.HistogramConfiguration<string>,
      );
    case "Summary":
      return new client.Summary(options as client.SummaryConfiguration<string>);
    default:
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Unknown type: ${type}`);
  }
}

/**
 * @public
 */
export function getToken(name: string): string {
  return `PROM_METRIC_${name.toUpperCase()}`;
}
