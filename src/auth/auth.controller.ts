import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials-dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() data: AuthCredentialsDto): Promise<Tokens> {
    return this.authService.signUp(data);
  }

  @Post('/signin')
  async signIn(
    @Body() data: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(data);
  }
}
