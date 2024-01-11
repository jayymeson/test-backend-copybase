import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UsePipes,
  ValidationPipe,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SubscriptionsService } from './subscriptions.service';
import { FileUploadDto } from './models/dto/subscription-dto';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('uploads')
@Controller('subscription')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new ValidationPipe())
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: '.xlsx',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileDto = new FileUploadDto();
    fileDto.file = file;

    const result = await this.subscriptionsService.processUploadedFile(file);
    return {
      message: 'Upload processado',
      insertedRecords: result.inserted,
      ignoredRecords: result.ignored,
    };
  }

  @Delete('delete-all')
  async deleteAll() {
    await this.subscriptionsService.deleteAllSubscriptions();
    return { message: 'Todos os registros foram apagados.' };
  }
}
