import { Get, Controller, Inject, Post, HttpCode, HttpStatus, UsePipes, ValidationPipe, Req, Body } from '@nestjs/common';
import { IsString } from 'class-validator';
import { FastifyUploadedFile, IFile } from './modules/common/decorators';

export class Dto {
  @IsString()
  text: string;
}

@Controller()
export class AppController {

@Post()
@HttpCode(HttpStatus.OK)
@UsePipes(ValidationPipe)
  async createMessage(@Req() req, @Body() body: Dto, @FastifyUploadedFile({ fieldname: 'attachment' }) attachment: IFile): Promise < any > {
    return {body, attachment};
  }
}
