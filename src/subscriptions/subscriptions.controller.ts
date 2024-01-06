import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UsePipes,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SubscriptionsService } from './subscriptions.service';
import { FileUploadDto } from './models/dto/subscription-dto';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('uploads')
@Controller('subscription')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

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
          format: '.xlsx or .csv',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileDto = new FileUploadDto();
    fileDto.file = file;
    // Aqui você pode validar fileDto ou fazer algo com ele
    const data = this.subscriptionsService.processUploadedFile(file);
    return data;
  }

  @Delete('delete-all')
  async deleteAll() {
    await this.subscriptionsService.deleteAllSubscriptions();
    return { message: 'Todos os registros foram apagados.' };
  }
}
