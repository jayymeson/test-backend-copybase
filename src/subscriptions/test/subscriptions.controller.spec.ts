import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsController } from '../subscriptions.controller';
import { SubscriptionsService } from '../subscriptions.service';
// import { FileInterceptor } from '@nestjs/platform-express';

describe('SubscriptionsController', () => {
  let controller: SubscriptionsController;
  let service: SubscriptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionsController],
      providers: [
        {
          provide: SubscriptionsService,
          useValue: {
            processUploadedFile: jest
              .fn()
              .mockResolvedValue({ inserted: 1, ignored: 0 }),
          },
        },
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
