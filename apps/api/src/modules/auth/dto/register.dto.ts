import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum, IsOptional, Matches } from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    description: 'User CPF (Brazilian tax ID)',
    example: '12345678901',
    pattern: '^[0-9]{11}$',
  })
  @IsString()
  @Matches(/^[0-9]{11}$/, { message: 'CPF must be exactly 11 digits' })
  cpf: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' }
  )
  password: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.CLIENT,
  })
  @IsEnum(UserRole, { message: 'Role must be CLIENT, PROVIDER, or ADMIN_PORTO' })
  role: UserRole;

  @ApiProperty({
    description: 'Porto Seguro policy number (required for clients)',
    example: 'PS123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  portoPolicy?: string;
}
