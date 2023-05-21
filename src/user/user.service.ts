import { Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { UserUseCases } from '@app/core';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class UserService {
  constructor(private readonly userUseCases: UserUseCases) {}

  async createUser(userData: CreateUserDto) {
    try {
      await this.userUseCases.create({
        ...userData,
      });
      return { message: 'User created successfully' };
    } catch (error: any) {
      if (error.message === 'User already exists') {
        throw new ConflictException('User already exists');
      }
    }
  }

  async login(
    loginData: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const { access_token, refresh_token } = await this.userUseCases.login(
        loginData,
      );

      response.cookie('Authentication', access_token, {
        httpOnly: true,
        sameSite: 'strict',
        // secure: true, // Set to true if using HTTPS
      });
    } catch (error: any) {
      if (error.message === 'User not found') {
        throw new UnauthorizedException('Invalid credentials');
      }
    }
  }
}
