import { ConfigService } from '@nestjs/config';
import { INestApplication, Logger, Type } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import SwaggerConfig from './SwaggerConfig';
import SwaggerOptions from 'src/modules/swagger/SwaggerOptions';

const header = 'header';
const apiKeyType = 'apiKey';
export const authorizationHeader = 'Authorization';
export default class SwaggerService {
    config: SwaggerConfig;

    constructor(configService: ConfigService, private logger: Logger) {
        this.config = SwaggerConfig.create(configService);
    }

    setup(app: INestApplication): void {
        // const swaggerService = new SwaggerService(app, configService);
        const swaggerService = this;

        if (swaggerService.config.enabled) {
            this.logger.log(
                `Swagger doc is running at http://localhost:${this.config.appPort}${this.config.apiPrefix}`,
            );
            // this.addSwaggerDecoratorInControllers(app);
            swaggerService.addBasicAuthentication(app);
            const document = swaggerService.createDocument(app);
            SwaggerModule.setup(swaggerService.swaggerEndpoint, app, document);
        }
    }

    private createDocument(app: INestApplication): OpenAPIObject {
        const options = new DocumentBuilder()
            // .addServer(this.config.apiPrefix)
            .setTitle(this.config.serviceName)
            .setDescription(this.config.description)
            .setVersion(this.config.version)
            .addApiKey({ type: apiKeyType, name: authorizationHeader, in: header }, authorizationHeader)
            .build();

        return SwaggerModule.createDocument(app, options);
    }

    private addBasicAuthentication(app: INestApplication): void {
        const { username } = this.config;
        const { password } = this.config;
        if (username) {
            app.use(
                this.swaggerEndpoint,
                basicAuth({
                    challenge: true,
                    users: {
                        [username]: password,
                    },
                }),
            );
        }
    }

    private addSwaggerDecoratorInControllers(controllers: Type<any>[]): void {
        controllers.forEach(a => {
            const hasSwaggerDecorator = Reflect.hasMetadata('swagger/apiSecurity', a);
            if (!hasSwaggerDecorator) {
                SwaggerOptions()(a);
            }
        });
    }

    private get swaggerEndpoint(): string {
        return `${this.config.apiPrefix}`;
    }
}
