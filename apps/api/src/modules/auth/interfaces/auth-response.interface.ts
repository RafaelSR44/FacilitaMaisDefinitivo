import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty({
    description: 'User information',
    example: {
      id: 'uuid',
      email: 'user@example.com',
      cpf: '12345678901',
      role: 'CLIENT',
      status: 'ACTIVE',
    },
  })
  user: {
    id: string;
    email: string;
    cpf: string;
    role: string;
    status: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    portoPolicy?: string;
    profile?: any;
    providerProfile?: any;
    createdAt: Date;
    updatedAt: Date;
  };

  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;
}
