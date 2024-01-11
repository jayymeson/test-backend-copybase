import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { AuthGuard } from '../auth.guard';
import { JwtModule } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;

  // Mock para AuthService
  const mockAuthService = {
    login: jest.fn(() => Promise.resolve({ token: 'someToken' })),
  };

  // Mock para AuthGuard
  const mockAuthGuard = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: AuthGuard, useValue: mockAuthGuard },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('login should return a token', async () => {
    const result = { token: 'someToken' };
    jest.spyOn(mockAuthService, 'login').mockResolvedValue(result);

    expect(
      await controller.login({ email: 'test@test.com', password: '123456' }),
    ).toEqual(result);
  });
});
