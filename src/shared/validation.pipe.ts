import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {

    console.log("si esta entrando a la exception validación 1");

    if (value instanceof Object && this.isEmpty(value)) {
      throw new HttpException('Validation failed: No body submitted', HttpStatus.BAD_REQUEST);
    }
    
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    console.log('va a verificar y posee mas caracteres > 0');
    
    if (errors.length > 0) {
      console.log('abc-123');
      
      // throw new BadRequestException('Validation failed');
      throw new HttpException(`Validation failed: ${this.formatErrors(errors)}`, HttpStatus.BAD_REQUEST);
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: any[]){
    return errors
      .map(err => {
        for (let property in err.constraints){
          return err.constraints[property];
        }
    }).join(', ');
  }

  private isEmpty(value: any){
    if(Object.keys(value).length > 0){
      return false;
    } 
    return true;
  }
}