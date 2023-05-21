import * as speakeasy from 'speakeasy';

export interface ITokenVerifier {
  verifyToken(secret: string, token: string): Promise<boolean>;
}

export class TokenVerifier implements ITokenVerifier {
  async verifyToken(secret: string, token: string): Promise<boolean> {
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1,
    });

    return verified;
  }
}
