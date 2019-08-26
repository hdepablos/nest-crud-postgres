import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate( context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) return false;

    const decode = await this.validateToken(request.headers.authorization);
    console.log(decode);

    request.user = decode;
    
    return true;
  }

  async validateToken(auth: string){
    const arrAuth = auth.split(' ');
    if (arrAuth[0] !== 'Bearer') throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    
    const token = arrAuth[1];
    try {
      const decode = jwt.verify(token, process.env.SECRET);
      return decode;
    } catch (error) {
      const message = `Token error ${error.message || error.name}`;
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}
