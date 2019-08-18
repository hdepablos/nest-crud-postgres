import { ExceptionFilter, Catch, HttpException, ArgumentsHost, Logger } from "@nestjs/common";

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost){
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const status = exception.getStatus();

        // response.status(404).json({found:false});

        const errorResponse = {
            code: status,
            // timestamp: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
            timestamp: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
            // timestamp: `${Date.now().toLocaleString()}`,
            path: request.url,
            method: request.method,
            message: exception.message.error || exception.message || 'Error'
        }

        Logger.error(
            `${request.method} ${request.url}`,
            JSON.stringify(errorResponse),
            'ExceptionFilter'
        )

        response.status(404).json(errorResponse);

    }
}