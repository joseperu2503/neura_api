import { Body, Controller, Get, Post } from '@nestjs/common';
import { Auth } from '../decorators/auth.decorator';
import { GetUser } from '../decorators/get-user.decorator';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { User } from '../schemas/user.schema';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() request: RegisterDto) {
    const { email, password } = request;
    return this.authService.register(email, password);
  }

  @Post('login')
  async login(@Body() request: LoginDto) {
    const { email, password } = request;
    return this.authService.login(email, password);
  }

  @Auth()
  @Get('profile')
  async getProfile(@GetUser() user: User) {
    return this.authService.getProfile(user);
  }

  @Get('guest/register')
  async guestRegister() {
    return this.authService.createGuestUser();
  }
}
