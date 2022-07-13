import { ConfigService } from '@nestjs/config';

export default class SwaggerConfig {
    serviceName: string;

    apiPrefix: string;

    version: string;

    description: string;

    enabled: boolean;

    username: string;

    password: string;

    appPort: number;

    static create(configService: ConfigService): SwaggerConfig {
        const config = new SwaggerConfig();

        config.appPort = configService.get<number>('APP_PORT');
        config.description = configService.get<string>('SWAGGER_DESC');
        config.username = configService.get<string>('SWAGGER_USERNAME');
        config.password = configService.get<string>('SWAGGER_PASSWORD');
        config.enabled = configService.get<boolean>('SWAGGER_ENABLED');
        config.version = configService.get<string>('SWAGGER_VERSION');
        config.apiPrefix = configService.get<string>('SWAGGER_PREFIX');

        return config;
    }
}
