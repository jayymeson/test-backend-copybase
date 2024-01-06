import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FileUploadDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'File .xlsx or .csv',
    example: 'file.xlsx',
  })
  file: Express.Multer.File;
}
