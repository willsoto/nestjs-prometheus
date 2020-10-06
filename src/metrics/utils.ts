import client from "prom-client";

type Metrics = "Gauge" | "Summary" | "Histogram" | "Counter";
type Options =
  | client.GaugeConfiguration<string>
  | client.SummaryConfiguration<string>
  | client.CounterConfiguration<string>
  | client.HistogramConfiguration<string>;

export function getOrCreateMetric(
  type: Metrics,
  options: Options,
): client.Metric<string> {
  const existingMetric = client.register.getSingleMetric(options.name);

  if (existingMetric) {
    return existingMetric;
  }

  switch (type) {
    case "Gauge":
      return new client.Gauge(options);
    case "Counter":
      return new client.Counter(options);
    case "Histogram":
      return new client.Histogram(options);
    case "Summary":
      return new client.Summary(options);
    default:
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Unknown type: ${type}`);
  }
}

export function getToken(name: string): string {
  return `PROM_METRIC_${name.toUpperCase()}`;
}
