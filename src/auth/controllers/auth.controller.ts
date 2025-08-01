import { Body, Controller, Get, Post } from '@nestjs/common';
import { GetUser } from '../decorators/get-user.decorator';
import { JwtAuth } from '../decorators/jwt-auth.decorator';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { User } from '../schemas/user.schema';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const { email, password } = registerDto;
    return this.authService.register(email, password);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }

  @JwtAuth()
  @Get('profile')
  async getProfile(@GetUser() user: User) {
    return this.authService.getProfile(user);
  }

  @Get('guest/register')
  async guestRegister() {
    return this.authService.createGuestUser();
  }
}
