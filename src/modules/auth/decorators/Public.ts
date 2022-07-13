import { LiteralObject } from '@nestjs/common';

export const publicMetadataKey = Symbol.for('PublicEndpointMetadata');

const Public = (): MethodDecorator => {
  return (
    _target: LiteralObject,
    _propertyKey: string,
    descriptor: TypedPropertyDescriptor<unknown>,
  ): void => {
    Reflect.defineMetadata(publicMetadataKey, true, descriptor.value);
  };
};

export default Public;
