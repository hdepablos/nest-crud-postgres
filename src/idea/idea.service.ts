import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IdeaEntity } from './idea.entity';
import { IdeaDto, IdeaRO } from './idea.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './../user/user.entity';
import { HttpErrorFilter } from 'shared/http-error.filter';

@Injectable()
export class IdeaService {
    
    constructor(
        @InjectRepository(IdeaEntity)
        private ideaRepository: Repository<IdeaEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<IdeaEntity>){
    }

    private toResponseObject(idea: IdeaEntity): IdeaRO{
        return {...idea, author: idea.author.toResponseObject(false)};
    }

    private ensureOwnership(idea: IdeaEntity, userId: string){
        if(idea.author.id !== userId){
            throw new HttpException('Incorrect user', HttpStatus.UNAUTHORIZED);
        }
    }

    async allIdeas(): Promise<IdeaRO[]>{
        const ideas = await this.ideaRepository.find({ relations: ['author'] });
        return ideas.map(idea => this.toResponseObject(idea));
    }
    
    async createIdea(userId: string, data: IdeaDto): Promise<IdeaRO>{
        const user = await this.userRepository.findOne({where: {id: userId }});

        const idea = await this.ideaRepository.create({...data, author: user});
        await this.ideaRepository.save(idea);
        return this.toResponseObject(idea);
    }

    async readIdea(id: string): Promise<IdeaRO>{
        const idea = await this.ideaRepository.findOne({ where: { id }})
        if (!idea) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        return this.toResponseObject(idea);
    }

    async updateIdea(id: string, userId: string, data: Partial<IdeaDto>): Promise<IdeaRO>{
        let idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author']});
        if (!idea) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        this.ensureOwnership(idea,userId);
        await this.ideaRepository.update({id}, data);
        idea = await this.ideaRepository.findOne({ where: {id}, relations: ['author']});
        return this.toResponseObject(idea);
        
        // // Funciona de esta, se puede actualizar un solo campo 
        // let idea = await this.ideaRepository.findOne({ where: { id }})
        // if (!idea) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        // const valor = await this.ideaRepository.update({id}, data);
        // idea = await this.ideaRepository.findOne({ where: { id }})
        // return idea;

    }

    async deleteIdea(id: string, userId: string){
        const idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author']});
        if (!idea) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        this.ensureOwnership(idea,userId);
        await this.ideaRepository.delete({id});
        return this.toResponseObject(idea);
    }
}