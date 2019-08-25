import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserDto, UserRO } from './user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) 
        private userRepository: Repository<UserEntity>
    ){}
    
    async allUser(): Promise<UserRO[]>{
        const users = await this.userRepository.find();
        return users.map(user => user.toResponseObject());
    }

    async login(data: UserDto): Promise<UserRO>{
        const { username, password } = data;
        const user = await this.userRepository.findOne({ where: { username }});
        if(!user || (await user.comparePassword(password))){
            throw new HttpException('Invalid user/password', HttpStatus.BAD_REQUEST);
        }

        return user.toResponseObject();
    }

    async register(data: UserDto): Promise<UserRO>{
        const {username} = data;
        console.log('Data');
        console.log(data);
        console.log('username is ');
        console.log(username);
        let user = await this.userRepository.findOne({where: {username}});
        console.log('pasoooo');
        
        if (user) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST)
        };
        
        console.log("va a guardar registro");
        user = await this.userRepository.create(data);
        await this.userRepository.save(user);
        return user.toResponseObject(); 
    }
}
