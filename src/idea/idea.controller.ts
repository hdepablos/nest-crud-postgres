import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes, Logger } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDto } from './idea.dto';
import { ValidationPipe } from "./../shared/validation.pipe";


@Controller('/api/idea')
export class IdeaController {
    private logger = new Logger('IdeaController');

    constructor(private ideaService: IdeaService){
    }

    @Get()
    ideas(){
        return this.ideaService.allIdeas();
    }

    @Post()
    @UsePipes(new ValidationPipe())
    createIdea(@Body() data: IdeaDto){
        this.logger.log(JSON.stringify(data));
        return this.ideaService.createIdea(data);
    }

    @Get(':id')
    idea(@Param('id') id: string){
        return this.ideaService.readIdea(id);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    updateIdea(@Param('id') id: string, @Body() data: Partial<IdeaDto>){
        this.logger.log(JSON.stringify(data));        
        return this.ideaService.updateIdea(id, data);
    }

    @Delete(':id')
    deleteIdea(@Param('id') id: string){
        return this.ideaService.deleteIdea(id);
    }
}
