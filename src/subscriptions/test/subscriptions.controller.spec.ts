import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsController } from '../subscriptions.controller';
import { SubscriptionsService } from '../subscriptions.service';
import { AuthGuard } from '../../auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';

describe('SubscriptionsController', () => {
  let controller: SubscriptionsController;
  let service: SubscriptionsService;

  const mockSubscriptionsService = {
    processUploadedFile: jest
      .fn()
      .mockResolvedValue({ inserted: 1, ignored: 0 }),
  };

  const mockAuthGuard = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      controllers: [SubscriptionsController],
      providers: [
        { provide: SubscriptionsService, useValue: mockSubscriptionsService },
        { provide: AuthGuard, useValue: mockAuthGuard },
      ],
    }).compile();

    controller = module.get<SubscriptionsController>(SubscriptionsController);
    service = module.get<SubscriptionsService>(SubscriptionsService);
  });

  it('should upload file and return result', async () => {
    const mockFile = {
      originalname: 'test.xlsx',
      buffer: Buffer.from([]),
    };

    const response = await controller.uploadFile(mockFile as any);
    expect(response).toEqual({
      message: 'Upload processado',
      insertedRecords: 1,
      ignoredRecords: 0,
    });
    expect(service.processUploadedFile).toHaveBeenCalledWith(mockFile);
  });
});
