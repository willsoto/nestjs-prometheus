import { DynamicModule, Module, Provider } from "@nestjs/common";
import { PATH_METADATA } from "@nestjs/common/constants";
import { collectDefaultMetrics } from "prom-client";
import { PROMETHEUS_OPTIONS } from "./constants";
import { PrometheusController } from "./controller";
import {
  PrometheusAsyncOptions,
  PrometheusOptions,
  PrometheusOptionsFactory,
} from "./interfaces";

@Module({})
export class PrometheusModule {
  public static forRoot(options?: PrometheusOptions): DynamicModule {
    const opts = PrometheusModule.makeDefaultOptions(options);

    if (opts.defaultMetrics.enabled) {
      collectDefaultMetrics(opts.defaultMetrics.config);
    }

    Reflect.defineMetadata(PATH_METADATA, opts.path, PrometheusController);

    return {
      module: PrometheusModule,
      controllers: [PrometheusController],
    };
  }

  public static forRootAsync(
    options: PrometheusAsyncOptions = {},
  ): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: PrometheusModule,
      imports: options.imports,
      providers: [...asyncProviders],
    };
  }

  public static createAsyncProviders(
    options: PrometheusAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    } else if (!options.useClass) {
      throw new Error("Invalid configuration");
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  public static createAsyncOptionsProvider(
    options: PrometheusAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: PROMETHEUS_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = options.useClass || options.useExisting;

    if (!inject) {
      throw new Error(
        "Invalid configuration. Must provide useFactory, useClass or useExisting",
      );
    }

    return {
      provide: PROMETHEUS_OPTIONS,
      async useFactory(
        optionsFactory: PrometheusOptionsFactory,
      ): Promise<PrometheusOptions> {
        const opts = await optionsFactory.createPrometheusOptions();

        return opts;
      },
      inject: [inject],
    };
  }

  private static makeDefaultOptions(
    options?: PrometheusOptions,
  ): Required<PrometheusOptions> {
    return {
      path: "/metrics",
      defaultMetrics: {
        enabled: true,
        config: {},
      },
      ...options,
    };
  }
}
