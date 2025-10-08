import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PortoOAuthStrategy extends PassportStrategy(Strategy, 'porto-oauth') {
  constructor(private readonly configService: ConfigService) {
    super({
      authorizationURL: `${configService.get('PORTO_API_BASE_URL')}/oauth/authorize`,
      tokenURL: `${configService.get('PORTO_API_BASE_URL')}/oauth/token`,
      clientID: configService.get('PORTO_OAUTH_CLIENT_ID'),
      clientSecret: configService.get('PORTO_OAUTH_CLIENT_SECRET'),
      callbackURL: '/api/v1/auth/porto/callback',
      scope: ['profile', 'policy'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
    // Extract user information from Porto Seguro profile
    const user = {
      portoId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      cpf: profile.cpf,
      policyNumber: profile.policyNumber,
      avatar: profile.photos[0]?.value,
      accessToken,
      refreshToken,
    };

    return user;
  }
}
