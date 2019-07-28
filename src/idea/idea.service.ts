import { Injectable } from '@nestjs/common';
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
        return await this.ideaRepository.findOne({ where: { id }})
    }
 
    async updateIdea(id: string, data: Partial<IdeaDto>){
        await this.ideaRepository.update({id}, data);
        return await this.ideaRepository.findOne({id});
    }

    async deleteIdea(id: string){
        await this.ideaRepository.delete({id});
        return {delete: true};
    }
}
