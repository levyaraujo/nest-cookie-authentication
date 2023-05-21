import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserRepository } from '../database/user.repository';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule,
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    JwtService,
    ConfigService,
    {
      provide: UserRepository,
      useClass: UserRepository,
    },
    {
      provide: AuthService,
      useFactory: (
        jwtService: JwtService,
        configService: ConfigService,
        userRepository: UserRepository,
      ) => new AuthService(jwtService, configService, userRepository),
      inject: [JwtService, ConfigService, UserRepository],
    },
  ],
  exports: [AuthService, UserRepository],
})
export class AuthModule {}
