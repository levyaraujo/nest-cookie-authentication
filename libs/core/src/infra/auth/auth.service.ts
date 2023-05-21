import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from 'src/user/dto/login.dto';
import { IUserRepository } from '@app/core/domain';
import { IToken } from './interfaces/token.interface';

export interface IAuthService {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
  generateJwtToken(loginData: LoginDto): Promise<IToken>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly userRepo: IUserRepository,
  ) {}
  private rounds = 10;

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.rounds);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      const passwordsMatch = await bcrypt.compare(password, hashedPassword);
      return passwordsMatch;
    } catch (error) {
      console.log(error);
    }
  }

  async generateJwtToken(loginData: LoginDto): Promise<IToken> {
    const payload = {
      email: loginData.email,
    };
    const user = await this.userRepo.findByEmail(loginData.email);
    const subject = user.id;
    const secret = this.config.get<string>('JWT_SECRET');

    console.log(user);
    const access_token = await this.jwtService.signAsync(payload, {
      secret,
      subject,
      expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRATION_TIME'),
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret,
      subject,
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRATION_TIME'),
    });

    return {
      access_token,
      refresh_token,
    };
  }
}
