import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDto } from './idea.dto';

@Controller('/api/idea')
export class IdeaController {
    constructor(private ideaService: IdeaService){
    }

    @Get()
    ideas(){
        return this.ideaService.allIdeas();
    }

    @Post()
    createIdea(@Body() data: IdeaDto){
        console.log(data);
        return this.ideaService.createIdea(data);
    }

    @Get(':id')
    idea(@Param('id') id: string){
        return this.ideaService.readIdea(id);
    }

    @Put(':id')
    updateIdea(@Param('id') id: string, @Body() data: Partial<IdeaDto>){
        console.log(id);
        console.log(data);
        
        
        return this.ideaService.updateIdea(id, data);
    }

    @Delete(':id')
    deleteIdea(@Param('id') id: string){
        return this.ideaService.deleteIdea(id);
    }
}
