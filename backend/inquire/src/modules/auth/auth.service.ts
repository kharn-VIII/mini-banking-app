import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { User } from '../users/entities/user.entity';
import { UpdateUserDto } from '../users/dto/update-user.dto';

interface TokenPayload {
  id: string;
  type?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginUserDto): Promise<AuthResponse> {
    try {
      const user = await this.userService.validatePassword(
        loginDto.email,
        loginDto.password,
      );

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const tokens = this.generateToken(user.id);
      return {
        ...tokens,
        user: this.mapUserToResponse(user),
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid email or password');
    }
  }

  async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
    try {
      const user = await this.userService.create(createUserDto);
      const tokens = this.generateToken(user.id);
      return {
        ...tokens,
        user: this.mapUserToResponse(user),
      };
    } catch (error) {
      if (error.status === 409) {
        throw error;
      }
      console.error('Registration error:', error);
      throw new BadRequestException(
        error.message || 'Failed to create user',
      );
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UpdateUserDto> {
    try {
      const user = await this.userService.update(id, updateUserDto);
      return user;
    } catch (error) {
      throw new BadRequestException('Failed to update user');
    }
  }

  validateToken(token: string): TokenPayload {
    try {
      const payload = this.jwtService.verify<TokenPayload>(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async refreshToken(token: string): Promise<AuthResponse> {
    const payload = this.validateToken(token);

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    let user: User;
    try {
      user = await this.userService.findById(payload.id);
    } catch (error) {
      throw new UnauthorizedException('User not found or invalid token');
    }

    const tokens = this.generateToken(user.id);
    return {
      ...tokens,
      user: this.mapUserToResponse(user),
    };
  }

  async getUserFromToken(token: string): Promise<User> {
    const payload = this.validateToken(token);
    return await this.userService.findById(payload.id);
  }

  // async logout(): Promise<void> {
    
  // }

  private generateToken(userId: string): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload = { id: userId };

    const accessTokenExpiresIn =
      this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN') || '15m';
    const refreshTokenExpiresIn =
      this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN') ||
      '7d';

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: accessTokenExpiresIn,
    });

    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      {
        expiresIn: refreshTokenExpiresIn,
      },
    );

    return { accessToken, refreshToken };
  }

  private mapUserToResponse(user: User) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  parseDuration(str: string): number {
    const units = {
      ms: 1,
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };
  
    const match = str.match(/^(\d+)(ms|s|m|h|d)$/);
    if (!match) return NaN;
  
    const [, value, unit] = match;
    return Number(value) * units[unit];
  }
}