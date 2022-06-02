import { NestInterceptor } from '@nestjs/common';
import AuthUser from 'src/auth/domain/AuthUser';
import { Context } from 'src/common/context';

enum AuthContextKeys {
  CURRENT_USER_KEY = 'CURRENT_USER_KEY',
}

export class AuthenticationContext {
  static setCurrentUser(appUser: AuthUser): void {
    Context.set(AuthContextKeys.CURRENT_USER_KEY, appUser);
  }

  static getCurrentUser(): AuthUser | null {
    return Context.get(AuthContextKeys.CURRENT_USER_KEY);
  }
}

export default class AuthenticationInterceptor implements NestInterceptor {
  private readonly allowList = new Map<string, boolean>();

  constructor(private readonly config: AuthConfig) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> {
    const isAllowed = this.isInAllowedList(context);

    if (!isAllowed) {
      this.verifyAuthorizationToken(context);
    }

    return next.handle();
  }

  private isInAllowedList(context: ExecutionContext): boolean {
    const handlerHash = `${context.getClass().name}.${context.getHandler().name
      }`;

    if (!this.allowList.has(handlerHash)) {
      const handlerMetadata = Reflect.getMetadata(
        publicMetadataKey,
        context.getHandler(),
      );
      this.allowList.set(handlerHash, handlerMetadata !== undefined);
    }

    return this.allowList.get(handlerHash);
  }

  private verifyAuthorizationToken(context: ExecutionContext): void {
    const isWebsocket = context.getType() === 'ws';
    const request = extractRequest(context, isWebsocket);
    const token = extractToken(request as Request, isWebsocket);
    const session = decodeToken(this.jwtPublicKey, this.encodeAlgorithm, token);

    const appUser = new AuthUser(
      session.userID,
      session.userExternalId,
      session.userRootOrg,
      session.rootOrganizationExternalId,
      session.userOrg,
      session.organizationExternalId,
      session.email,
      session.claims,
    );

    request.user = appUser;
    AuthenticationContext.setCurrentUser(appUser);
  }

  get jwtPublicKey(): string {
    return this.config.jwtPublicKey;
  }

  get encodeAlgorithm(): string {
    return this.config.encodeAlgorithm;
  }
}
