import { IUserRepository } from '../domain/user.repository';
import { User, IUser } from '../domain/user.entity';
import { LoginDto } from 'src/user/dto/login.dto';
import { ITokenVerifier } from '@app/core';
import { IAuthService } from '../infra/auth/auth.service';
import { ObjectId } from 'mongodb';
import { IToken } from '../infra/auth/interfaces/token.interface';

export class UserUseCases {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenVerifier: ITokenVerifier,
    private readonly authService: IAuthService,
  ) {}

  async create(userData: IUser) {
    userData.password = await this.authService.hashPassword(userData.password);
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = new User({ id: new ObjectId().toHexString(), ...userData });
    await this.userRepository.save(user);
    return user;
  }

  async login(loginData: LoginDto): Promise<IToken> {
    const { email, password, token } = loginData;
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    console.log(user.password);

    const tokenIsCorrect = await this.tokenVerifier.verifyToken(
      user.secretToken,
      token,
    );

    const passwordIsCorrect = await this.authService.comparePassword(
      password,
      user.password,
    );

    console.log(passwordIsCorrect);

    if (passwordIsCorrect) {
      return await this.authService.generateJwtToken(loginData);
    }
  }
}
