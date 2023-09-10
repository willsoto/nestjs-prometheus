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
  const optionsWithPrefix: Options = { ...options };
  if (prometheusOptions?.prefix) {
    optionsWithPrefix.name = prometheusOptions?.prefix.concat(
      "_",
      options.name,
    );
  }

  const existingMetric = client.register.getSingleMetric(
    optionsWithPrefix.name,
  );
  if (existingMetric) {
    return existingMetric;
  }

  switch (type) {
    case "Gauge":
      return new client.Gauge(
        optionsWithPrefix as client.GaugeConfiguration<string>,
      );
    case "Counter":
      return new client.Counter(
        optionsWithPrefix as client.CounterConfiguration<string>,
      );
    case "Histogram":
      return new client.Histogram(
        optionsWithPrefix as client.HistogramConfiguration<string>,
      );
    case "Summary":
      return new client.Summary(
        optionsWithPrefix as client.SummaryConfiguration<string>,
      );
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
