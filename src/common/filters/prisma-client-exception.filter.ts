import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = 500;
    let message: string | object = 'Internal server error';

    switch (exception.code) {
      case 'P2002': // Unique constraint
        status = 409;
        message = `Unique constraint failed on fields: ${exception.meta?.target}`;
        break;
      case 'P2003': // Foreign key violation
        status = 400;
        message = `Invalid reference: ${exception.meta?.field_name}`;
        break;
      case 'P2025': // Record not found
        status = 404;
        message = 'Resource not found';
        break;
      case 'P2001': // Where condition didn't match any records
        status = 404;
        message = 'No matching record found';
        break;
      default:
        status = 500;
        message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      error: message,
      path: ctx.getRequest().url,
      timestamp: new Date().toISOString(),
    });
  }
}
