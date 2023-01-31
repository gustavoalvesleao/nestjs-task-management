import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies';
import { jwtConstants } from './constants';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  providers: [AuthService, PrismaService, AccessTokenStrategy], // Will be injected as dependencies in this module
  controllers: [AuthController],
  exports: [AccessTokenStrategy, PassportModule], // Exports for instance the AuthService, in case a different module wants to use it
})
export class AuthModule {}
