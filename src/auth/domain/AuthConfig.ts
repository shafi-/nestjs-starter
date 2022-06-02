import { Config } from '@nestjs/common';
import { base64, enumOption } from '@/config/parsers';
import { Algorithm } from 'jsonwebtoken';

export default class AuthConfig {
  @Config('JWT_PUBLIC_KEY', { parser: base64(true) })
  jwtPublicKey: string;

  @Config('JWT_ENCODING_ALGORITHM', {
    parser: enumOption(['RS256']),
  })
  encodeAlgorithm: Algorithm;
}
