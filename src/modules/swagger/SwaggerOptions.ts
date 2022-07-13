import { applyDecorators } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import SwaggerOptionsModel from './SwaggerOptionsModel';
import { authorizationHeader } from './SwaggerService';

export default function SwaggerOptions(options?: SwaggerOptionsModel): MethodDecorator & ClassDecorator {
    const swaggerOptions = { ...new SwaggerOptionsModel(), ...options };
    const decorators: ClassDecorator | MethodDecorator | PropertyDecorator[] = [];

    if (swaggerOptions.authorizationHeader) {
        decorators.push(ApiSecurity(authorizationHeader));
    }

    if (swaggerOptions.tagName) {
        decorators.push(ApiTags(swaggerOptions.tagName));
    }

    return applyDecorators(...decorators);
}
