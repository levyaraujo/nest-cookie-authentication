import { UserUseCases } from '../application/use-cases';
import { ObjectId } from 'mongodb';
import { IUser, User } from '../domain';
import { UserInMemoryRepository } from '../infra/database/in-memory/user.in-memory.repository';
import { IAuthService } from '../infra/auth/auth.service';
import * as bcrypt from 'bcrypt';
import { Test } from '@nestjs/testing';
import { TokenVerifier } from '../infra/auth/token-verifier';

class AuthServiceMock implements IAuthService {
  rounds = 10;

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.rounds);
  }
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    return passwordsMatch;
  }
  generateJwtToken(data: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
}

const user: IUser = {
  id: new ObjectId().toHexString(),
  name: 'John Doe',
  email: 'john@gmail.com',
  password: '123456',
};

describe('UserUseCases', () => {
  let userUseCases: UserUseCases;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserInMemoryRepository,
        AuthServiceMock,
        TokenVerifier,
        {
          provide: UserUseCases,
          useFactory: (
            userRepository: UserInMemoryRepository,
            tokenVerifier: TokenVerifier,
            authService: AuthServiceMock,
          ) => new UserUseCases(userRepository, tokenVerifier, authService),
          inject: [UserInMemoryRepository, TokenVerifier, AuthServiceMock],
        },
      ],
    }).compile();

    userUseCases = moduleRef.get<UserUseCases>(UserUseCases);
  });

  test('should create a new user', async () => {
    const createdUser = await userUseCases.create(user);
    console.log(createdUser);
    expect(createdUser).toBeInstanceOf(User);
  });
});
