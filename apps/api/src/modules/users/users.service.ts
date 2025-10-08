import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        providerProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { passwordHash, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        providerProfile: true,
      },
    });
  }

  async findByCpf(cpf: string) {
    return this.prisma.user.findUnique({
      where: { cpf },
      include: {
        profile: true,
        providerProfile: true,
      },
    });
  }
}
