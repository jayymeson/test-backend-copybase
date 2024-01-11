import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './models/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    // Mocked user credentials
    const mockedEmail = 'copybase@test.com';
    const mockedPassword = 'Abc1234*';

    if (email === mockedEmail && password === mockedPassword) {
      const payload = { email, sub: 'mockedUserId' };
      const token = this.jwtService.sign(payload);
      return { token };
    }

    throw new UnauthorizedException('Invalid email and/or password');
  }
}
