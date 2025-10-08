import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from '../../config/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthResponse } from './interfaces/auth-response.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, cpf, password, role, portoPolicy } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { cpf }],
      },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email or CPF already exists');
    }

    // Validate Porto policy if provided
    if (portoPolicy && role === 'CLIENT') {
      const isValidPolicy = await this.validatePortoPolicy(cpf, portoPolicy);
      if (!isValidPolicy) {
        throw new BadRequestException('Invalid Porto Seguro policy number');
      }
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        cpf,
        passwordHash,
        role,
        portoPolicy,
        status: 'PENDING',
      },
      include: {
        profile: true,
        providerProfile: true,
      },
    });

    this.logger.log(`New user registered: ${user.id} (${user.email})`);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        providerProfile: true,
      },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (user.status === 'SUSPENDED' || user.status === 'BANNED') {
      throw new UnauthorizedException(`Account is ${user.status.toLowerCase()}`);
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    this.logger.log(`User logged in: ${user.id} (${user.email})`);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        providerProfile: true,
      },
    });

    if (user && user.passwordHash && await bcrypt.compare(password, user.passwordHash)) {
      return this.sanitizeUser(user);
    }
    return null;
  }

  async validateJwtPayload(payload: JwtPayload): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        profile: true,
        providerProfile: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.status === 'SUSPENDED' || user.status === 'BANNED') {
      throw new UnauthorizedException(`Account is ${user.status.toLowerCase()}`);
    }

    return this.sanitizeUser(user);
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponse> {
    const { refreshToken } = refreshTokenDto;

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: {
          profile: true,
          providerProfile: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const tokens = await this.generateTokens(user);

      return {
        user: this.sanitizeUser(user),
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<{ message: string }> {
    // In a real implementation, you might want to blacklist the token
    // For now, we'll just log the logout
    this.logger.log(`User logged out: ${userId}`);
    
    return { message: 'Logged out successfully' };
  }

  private async generateTokens(user: any): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: any) {
    const { passwordHash, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  private async validatePortoPolicy(cpf: string, policyNumber: string): Promise<boolean> {
    try {
      // TODO: Implement actual Porto Seguro API validation
      // For now, return true for demo purposes
      this.logger.debug(`Validating Porto policy ${policyNumber} for CPF ${cpf}`);
      return true;
    } catch (error) {
      this.logger.error('Error validating Porto policy:', error);
      return false;
    }
  }

  // Porto OAuth integration
  async handlePortoOAuth(portoUser: any): Promise<AuthResponse> {
    let user = await this.prisma.user.findUnique({
      where: { email: portoUser.email },
      include: {
        profile: true,
        providerProfile: true,
      },
    });

    if (!user) {
      // Create new user from Porto OAuth
      user = await this.prisma.user.create({
        data: {
          email: portoUser.email,
          cpf: portoUser.cpf,
          role: 'CLIENT',
          portoPolicy: portoUser.policyNumber,
          status: 'ACTIVE',
          emailVerified: true,
          profile: {
            create: {
              fullName: portoUser.name,
              avatarUrl: portoUser.avatar,
            },
          },
        },
        include: {
          profile: true,
          providerProfile: true,
        },
      });

      this.logger.log(`New user created via Porto OAuth: ${user.id} (${user.email})`);
    } else {
      // Update last login
      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
    }

    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }
}
