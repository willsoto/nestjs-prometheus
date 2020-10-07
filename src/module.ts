import { DynamicModule, Module, Provider } from "@nestjs/common";
import { collectDefaultMetrics } from "prom-client";
import { PROMETHEUS_OPTIONS } from "./constants";
import { PrometheusController } from "./controller";
import {
  PrometheusAsyncOptions,
  PrometheusOptions,
  PrometheusOptionsFactory,
} from "./interfaces";

/**
 * @public
 */
@Module({})
export class PrometheusModule {
  public static register(options?: PrometheusOptions): DynamicModule {
    const opts = PrometheusModule.makeDefaultOptions(options);

    PrometheusModule.configureServer(opts);

    return {
      module: PrometheusModule,
      controllers: [opts.controller],
    };
  }

  public static registerAsync(options: PrometheusAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);
    const controller = options.controller ?? PrometheusController;

    return {
      module: PrometheusModule,
      controllers: [controller],
      imports: options.imports,
      providers: [...asyncProviders],
    };
  }

  public static createAsyncProviders(
    options: PrometheusAsyncOptions,
  ): Provider[] {
    if (options.useExisting) {
      return [this.createAsyncOptionsProvider(options)];
    } else if (!options.useClass) {
      throw new Error(
        "Invalid configuration. Must provide useClass or useExisting",
      );
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
    /**
     * Not currently supported since there doesn't seem to be a way to get
     * the result of the function during configuration.
     */
    // if (options.useFactory) {
    //   return {
    //     provide: PROMETHEUS_OPTIONS,
    //     useFactory: options.useFactory,
    //     inject: options.inject || [],
    //   };
    // }

    const inject = options.useClass || options.useExisting;

    if (!inject) {
      throw new Error(
        "Invalid configuration. Must provide useClass or useExisting",
      );
    }

    return {
      provide: PROMETHEUS_OPTIONS,
      async useFactory(
        optionsFactory: PrometheusOptionsFactory,
      ): Promise<PrometheusOptions> {
        const userOptions = await optionsFactory.createPrometheusOptions();
        const opts = PrometheusModule.makeDefaultOptions(userOptions);

        PrometheusModule.configureServer(opts);

        return opts;
      },
      inject: [inject],
    };
  }

  private static configureServer(options: Required<PrometheusOptions>): void {
    if (options.defaultMetrics.enabled) {
      collectDefaultMetrics(options.defaultMetrics.config);
    }

    Reflect.defineMetadata("path", options.path, options.controller);
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
      controller: PrometheusController,
      ...options,
    };
  }
}
