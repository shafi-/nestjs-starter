import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

const LoginStrategyName = 'local';

@Injectable()
export default class LocalGuard extends AuthGuard(LoginStrategyName) {}
