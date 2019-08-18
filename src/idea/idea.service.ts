import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IdeaEntity } from './idea.entity';
import { IdeaDto } from './idea.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class IdeaService {
    
    constructor(
        @InjectRepository(IdeaEntity)
        private ideaRepository: Repository<IdeaEntity>){
    }

    async allIdeas(){
        return await this.ideaRepository.find();
    }

    async createIdea(data: IdeaDto){
        
        const idea = await this.ideaRepository.create(data);
        await this.ideaRepository.save(idea);
        return idea;
    }

    async readIdea(id: string){
        const idea = await this.ideaRepository.findOne({ where: { id }})
        if (!idea) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

        return idea;
    }
 
    async updateIdea(id: string, data: Partial<IdeaDto>){
        let idea = await this.ideaRepository.findOne({ where: { id }})
        if (!idea) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        
        const valor = await this.ideaRepository.update({id}, data);

        // console.log('valor');
        // console.log(valor);

        idea = await this.ideaRepository.findOne({ where: { id }})
        return idea;
    }

    async deleteIdea(id: string){
        const idea = await this.ideaRepository.findOne({ where: { id }})
        if (!idea) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        
        await this.ideaRepository.delete({id});
        return idea;
    }
}