import { Controller, Post, Get, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from 'src/shared/logging.interceptor';
import { UserService } from './user.service';
import { UserDto } from './user.dto';

@Controller()
export class UserController {
    constructor(private userService: UserService){
    }

    @Get('api/users')
    allUsers(){
        return this.userService.allUser();
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    login(@Body() data: UserDto){
        return this.userService.login(data);
    }

    @Post('register')
    @UsePipes(new ValidationPipe())
    register(@Body() data: UserDto){
        return this.userService.register(data);
    }
}
