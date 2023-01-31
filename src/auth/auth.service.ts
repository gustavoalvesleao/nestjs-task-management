import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthCredentialsDto } from './dto/auth-credentials-dto';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signUp(data: AuthCredentialsDto): Promise<Tokens> {
    const { password } = data;
    const hashedPassword = await this.getHashedPassword(password);

    const user = await this.prisma.user
      .create({
        data: { ...data, password: hashedPassword },
      })
      .catch((e) => {
        this.handleUserError(data, e);
      });

    if (user) {
      return this.getTokens({ username: user.username, id: user.id });
    }
  }

  async signIn(data: AuthCredentialsDto): Promise<Tokens> {
    const { password, username } = data;

    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException('This user does not exist');
    }

    if (await this.passwordMatches(password, user.password)) {
      return this.getTokens({ username, id: user.id });
    }

    throw new UnauthorizedException('Your password does not match');
  }

  private handleUserError(
    data: AuthCredentialsDto,
    e: Prisma.PrismaClientKnownRequestError,
  ) {
    if (e.code === 'P2002') {
      throw new ConflictException(
        `User with username ${data.username} already exists`,
      );
    }
    throw new InternalServerErrorException(
      `It was not possible to create your user. Error code: ${e.code}`,
    );
  }

  private async getHashedPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private async passwordMatches(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }

  private getTokens(payload: JwtPayload) {
    return { accessToken: this.jwtService.sign(payload) };
  }
}
