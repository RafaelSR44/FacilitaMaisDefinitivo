import { UserRole } from '@prisma/client';

export interface JwtPayload {
  sub: string; // user ID
  email: string;
  role: UserRole;
  iat?: number; // issued at
  exp?: number; // expires at
}
