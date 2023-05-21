import { Controller, Post, Body, Res, UseGuards, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { IUser } from '@app/core';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { JwtAuthGuard } from '@app/core/infra/auth/guards/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async createUser(@Body() userData: IUser) {
    return await this.userService.createUser(userData);
  }

  @Post('login')
  async login(
    @Body() userData: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.userService.login(userData, response);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile() {
    return 'Profile';
  }
}
