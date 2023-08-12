import {
  DynamicModule,
  FactoryProvider,
  Module,
  Provider,
} from "@nestjs/common";
import * as promClient from "prom-client";
import { PROMETHEUS_OPTIONS, PROM_CLIENT } from "./constants";
import { PrometheusController } from "./controller";
import {
  PrometheusAsyncOptions,
  PrometheusOptions,
  PrometheusOptionsFactory,
  PrometheusOptionsWithDefaults,
} from "./interfaces";

/**
 * The primary entrypoint. This should be registered once in the root application module.
 *
 * @public
 */
@Module({})
export class PrometheusModule {
  public static register(options?: PrometheusOptions): DynamicModule {
    const opts = PrometheusModule.makeDefaultOptions(options);

    PrometheusModule.configureServer(opts);

    const providers: Provider[] = [];
    if (options?.pushgateway !== undefined) {
      const { url, options: gatewayOptions, registry } = options.pushgateway;
      providers.push({
        provide: promClient.Pushgateway,
        useValue: PrometheusModule.configurePushgateway(
          url,
          gatewayOptions,
          registry,
        ),
      });
    }

    return {
      module: PrometheusModule,
      providers,
      controllers: [opts.controller],
      exports: providers,
    };
  }

  public static registerAsync(options: PrometheusAsyncOptions): DynamicModule {
    const providers = this.createAsyncProviders(options);
    const controller = options.controller ?? PrometheusController;

    return {
      module: PrometheusModule,
      controllers: [controller],
      imports: options.imports,
      providers: [
        ...providers,
        {
          provide: PROM_CLIENT,
          inject: [PROMETHEUS_OPTIONS],
          useFactory(userOptions: PrometheusOptions) {
            const opts = PrometheusModule.makeDefaultOptions(userOptions);

            PrometheusModule.configureServer(opts);

            return promClient;
          },
        },
      ],
      exports: [...providers],
    };
  }

  public static createAsyncProviders(
    options: PrometheusAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [
        this.createAsyncOptionsProvider(options),
        PrometheusModule.createPushgatewayProvider(),
      ];
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
      PrometheusModule.createPushgatewayProvider(),
    ];
  }

  public static createAsyncOptionsProvider(
    options: PrometheusAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: PROMETHEUS_OPTIONS,
        // eslint-disable-next-line @typescript-eslint/unbound-method
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

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
        return optionsFactory.createPrometheusOptions();
      },
      inject: [inject],
    };
  }

  private static configureServer(options: PrometheusOptionsWithDefaults): void {
    if (options.defaultMetrics.enabled) {
      promClient.collectDefaultMetrics(options.defaultMetrics.config);
    }

    if (Object.keys(options.defaultLabels).length > 0) {
      promClient.register.setDefaultLabels(options.defaultLabels);
    }

    Reflect.defineMetadata("path", options.path, options.controller);
  }

  private static configurePushgateway(
    url: string,
    options?: unknown,
    registry?: promClient.Registry,
  ): promClient.Pushgateway {
    return new promClient.Pushgateway(url, options, registry);
  }

  private static createPushgatewayProvider(): FactoryProvider {
    return {
      provide: promClient.Pushgateway,
      inject: [PROMETHEUS_OPTIONS],
      useFactory(options: PrometheusOptions) {
        if (options?.pushgateway !== undefined) {
          const {
            url,
            options: gatewayOptions,
            registry,
          } = options.pushgateway;

          return PrometheusModule.configurePushgateway(
            url,
            gatewayOptions,
            registry,
          );
        }

        return null;
      },
    };
  }

  private static makeDefaultOptions(
    options?: PrometheusOptions,
  ): PrometheusOptionsWithDefaults {
    return {
      path: "/metrics",
      defaultMetrics: {
        enabled: true,
        config: {},
      },
      controller: PrometheusController,
      defaultLabels: {},
      ...options,
    };
  }
}
