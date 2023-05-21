import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserInMemoryRepository } from '../database/in-memory/user.in-memory.repository';

describe('AuthService', () => {
  let service: AuthService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule, ConfigModule],
      providers: [
        JwtService,
        ConfigService,
        {
          provide: UserInMemoryRepository,
          useClass: UserInMemoryRepository,
        },
        {
          provide: AuthService,
          useFactory: (
            jwtService: JwtService,
            configService: ConfigService,
            userRepository: UserInMemoryRepository,
          ) => new AuthService(jwtService, configService, userRepository),
          inject: [JwtService, ConfigService, UserInMemoryRepository],
        },
      ],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
  });

  it('should hash a password', async () => {
    const password = 'password';
    const hashedPassword = await service.hashPassword(password);
    const regex = /^\$2b\$10\$[A-Za-z0-9./]{53}$/;
    expect(hashedPassword).toMatch(regex);
  });

  it('should compare a password', async () => {
    const password = 'password';
    const hashedPassword = await service.hashPassword(password);
    const comparedPassword = await service.comparePassword(
      password,
      hashedPassword,
    );
    expect(comparedPassword).toBe(true);
  });
});
