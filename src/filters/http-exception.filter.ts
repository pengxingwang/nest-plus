import dayjs from 'dayjs';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const nowDate = dayjs().format('YYYY-MM-DD HH:mm:ss');

    // 包装异常信息
    const errorResponse = {
      code: status,
      message: exception.message,
      error: exception.name,
      date: nowDate,
      path: request.url,
      success: false,
    };

    this.logger.error(
      `【${nowDate}】${request.method} ${request.url} query:${JSON.stringify(
        request.query,
      )} params:${JSON.stringify(request.params)} body:${JSON.stringify(
        request.body,
      )} errorResponse: ${JSON.stringify(errorResponse)}`,
    );

    response.json(errorResponse);
  }
}
