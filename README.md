# NestJS Prometheus

![](https://github.com/willsoto/nestjs-prometheus/workflows/tests/badge.svg)

<!-- toc -->

- [Installation](#installation)
- [Usage](#usage)
  - [Changing the metrics http endpoint](#changing-the-metrics-http-endpoint)
  - [Disabling default metrics collection](#disabling-default-metrics-collection)
  - [Configuring the default metrics](#configuring-the-default-metrics)
- [Injecting individual metrics](#injecting-individual-metrics)
- [Setting default labels](#setting-default-labels)
- [Available metrics](#available-metrics)
  - [Counter](#counter)
  - [Gauge](#gauge)
  - [Histogram](#histogram)
  - [Summary](#summary)
- [Providing a custom controller](#providing-a-custom-controller)
- [Pushgateway](#pushgateway)

<!-- tocstop -->

## Installation

```bash
yarn add @willsoto/nestjs-prometheus prom-client
```

```bash
npm install @willsoto/nestjs-prometheus prom-client
```

## Usage

```typescript
import { Module } from "@nestjs/common";
import { PrometheusModule } from "@willsoto/nestjs-prometheus";

@Module({
  imports: [PrometheusModule.register()],
})
export class AppModule {}
```

By default, this will register a `/metrics` endpoint that will return the [default metrics](https://github.com/siimon/prom-client#default-metrics).

### Changing the metrics http endpoint

```typescript
import { Module } from "@nestjs/common";
import { PrometheusModule } from "@willsoto/nestjs-prometheus";

@Module({
  imports: [
    PrometheusModule.register({
      path: "/mymetrics",
    }),
  ],
})
export class AppModule {}
```

### Disabling default metrics collection

```typescript
import { Module } from "@nestjs/common";
import { PrometheusModule } from "@willsoto/nestjs-prometheus";

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: false,
      },
    }),
  ],
})
export class AppModule {}
```

### Configuring the default metrics

```typescript
import { Module } from "@nestjs/common";
import { PrometheusModule } from "@willsoto/nestjs-prometheus";

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        // See https://github.com/siimon/prom-client#configuration
        config: {},
      },
    }),
  ],
})
export class AppModule {}
```

## Injecting individual metrics

```typescript
// module.ts
import { Module } from "@nestjs/common";
import {
  PrometheusModule,
  makeCounterProvider,
} from "@willsoto/nestjs-prometheus";
import { Service } from "./service";

@Module({
  imports: [PrometheusModule.register()],
  providers: [
    Service,
    makeCounterProvider({
      name: "metric_name",
      help: "metric_help",
    }),
  ],
})
export class AppModule {}
```

```typescript
// service.ts
import { Injectable } from "@nestjs/common";
import { Counter } from "prom-client";
import { InjectMetric } from "@willsoto/nestjs-prometheus";

@Injectable()
export class Service {
  constructor(@InjectMetric("metric_name") public counter: Counter<string>) {}
}
```

## Setting default labels

```typescript
import { Module } from "@nestjs/common";
import { PrometheusModule } from "@willsoto/nestjs-prometheus";

@Module({
  imports: [
    PrometheusModule.register({
      defaultLabels: {
        app: "My app",
      },
    }),
  ],
})
export class AppModule {}
```

See the [docs](https://github.com/siimon/prom-client#default-labels-segmented-by-registry) for more information.

## Available metrics

#### [Counter](https://github.com/siimon/prom-client#counter)

```typescript
import { makeCounterProvider } from "@willsoto/nestjs-prometheus";
```

#### [Gauge](https://github.com/siimon/prom-client#gauge)

```typescript
import { makeGaugeProvider } from "@willsoto/nestjs-prometheus";
```

#### [Histogram](https://github.com/siimon/prom-client#histogram)

```typescript
import { makeHistogramProvider } from "@willsoto/nestjs-prometheus";
```

#### [Summary](https://github.com/siimon/prom-client#summary)

```typescript
import { makeSummaryProvider } from "@willsoto/nestjs-prometheus";
```

## Providing a custom controller

If you need to implement any special logic or have access to the controller (e.g., to customize [Swagger](https://docs.nestjs.com/openapi/introduction)),
you can provide your own controller (or subclass) of the default controller.

Here is a basic example which should be enough to extend or customize in any way you might need.

```typescript
// my-custom-controller.ts
import { PrometheusController } from "@willsoto/nestjs-prometheus";
import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";

@Controller()
class MyCustomController extends PrometheusController {
  @Get()
  async index(@Res() response: Response) {
    return super.index(response);
  }
}
```

```typescript
import { Module } from "@nestjs/common";
import { PrometheusModule } from "@willsoto/nestjs-prometheus";
import { MyCustomController } from "./my-custom-controller";

@Module({
  imports: [
    PrometheusModule.register({
      controller: MyCustomController,
    }),
  ],
})
export class AppModule {}
```

## Pushgateway

In order to enable Pushgateway for injection, provide the configuration under the `pushgateway` key.

```typescript
import { Module } from "@nestjs/common";
import { PrometheusModule } from "@willsoto/nestjs-prometheus";

@Module({
  imports: [
    PrometheusModule.register({
      pushgateway: {
        url: "http://127.0.0.1:9091",
      },
    }),
  ],
})
export class AppModule {}
```

```typescript
import { Injectable, Inject } from "@nestjs/common";
import * as client from "prom-client";
import {
  PrometheusModule,
  PROMETHEUS_PUSH_GATEWAY,
} from "@willsoto/nestjs-prometheus";

@Injectable()
export class Service {
  constructor(private readonly pushgateway: client.Pushgateway) {}
}
```
