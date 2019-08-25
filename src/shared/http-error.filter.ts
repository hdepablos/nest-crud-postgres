import { ExceptionFilter, Catch, HttpException, HttpStatus, ArgumentsHost, Logger } from "@nestjs/common";

// @Catch()
@Catch()
export class HttpErrorFilter implements ExceptionFilter {
    
    catch(exception: HttpException, host: ArgumentsHost){
        console.log("exeptionFilterrrrrr");
        
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        // ? exception.getStatus()
        // : HttpStatus.INTERNAL_SERVER_ERROR;

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

        console.log('paso 222');

        Logger.error(
            `${request.method} ${request.url}`,
            JSON.stringify(errorResponse),
            'ExceptionFilter'
        )

        console.log('paso 333');

        response.status(404).json(errorResponse);
    }
}