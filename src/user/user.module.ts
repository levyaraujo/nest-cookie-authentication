import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthService, IAuthService, UserUseCases } from '@app/core';
import { IUserRepository } from '@app/core';
import { ITokenVerifier, TokenVerifier } from '@app/core';
import { UserRepository } from '@app/core/infra/database/user.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '@app/core/infra/database/database.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from '@app/core/infra/auth/auth.module';
import { GuardModule } from '@app/core/infra/auth/strategy/jwt.strategy.module';

@Module({
  imports: [
    GuardModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    DatabaseModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    JwtService,
    ConfigService,
    TokenVerifier,
    {
      provide: UserUseCases,
      useFactory: (
        userRepository: IUserRepository,
        tokenVerifier: ITokenVerifier,
        authService: IAuthService,
      ) => new UserUseCases(userRepository, tokenVerifier, authService),
      inject: [UserRepository, TokenVerifier, AuthService],
    },
  ],
})
export class UserModule {}
