import { Module } from "@nestjs/common";
import {
  PrometheusModule,
  makeCounterProvider,
  makeGaugeProvider,
  makeHistogramProvider,
  makeSummaryProvider,
} from "../../src";

const counter = makeCounterProvider({
  name: "counter",
  help: "counter helper",
});

const gauge = makeGaugeProvider({
  name: "gauge",
  help: "gauge helper",
});

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: false,
      },
      customMetricPrefix: "app",
    }),
  ],
  providers: [
    counter,
    gauge,
    makeHistogramProvider({
      name: "histogram",
      help: "histrogram helper",
    }),
    makeSummaryProvider({
      name: "summary",
      help: "summary helper",
    }),
  ],
  exports: [PrometheusModule, counter, gauge],
})
export class CorePrefixModule {}
