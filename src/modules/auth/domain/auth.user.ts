import { LiteralObject } from '@nestjs/common';

export default class AuthUser {
  id?: string;

  fullName: string;

  email: string;

  phone: string;

  jwt?: string;

  static of(user: LiteralObject): AuthUser {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
    };
  }
}
