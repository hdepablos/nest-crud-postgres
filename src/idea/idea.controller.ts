import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes, Logger, UseGuards, Query } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDto } from './idea.dto';
import { ValidationPipe } from "./../shared/validation.pipe";
import { AuthGuard } from './../shared/auth.guard';
import { User } from './../user/user.decorator';
import { userInfo } from 'os';


@Controller('/api/idea')
export class IdeaController {
    private logger = new Logger('IdeaController');

    constructor(private ideaService: IdeaService){
    }

    private logData(options: any){
        options.user && this.logger.log(`USER ${JSON.stringify(options.user)}`);
        options.body && this.logger.log(`DATA ${JSON.stringify(options.data)}`);
        options.id && this.logger.log(`IDEA ${JSON.stringify(options.id)}`);
    }

    @Get()
    ideas(){
        return this.ideaService.allIdeas();
    }

    @Get('/pag')
    ideasPag(@Query('page') page: number){
        return this.ideaService.allIdeasPag(page);
    }

    @Get('/newest')
    showNewestIdeas(@Query('page') page:number){
        return this.ideaService.allIdeasPag(page, true)
    }



    @Post()
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    createIdea(@User('id') user, @Body() data: IdeaDto){
        // this.logData({user, data});
        return this.ideaService.createIdea(user, data);
    }

    @Get(':id')
    idea(@Param('id') id: string){
        return this.ideaService.readIdea(id);
    }

    @Put(':id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    updateIdea(@Param('id') id: string, @User('id') user: string,  @Body() data: Partial<IdeaDto>){
        // this.logger.log(JSON.stringify(data));
        this.logData({id, data, user});
        return this.ideaService.updateIdea(id, user, data);
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    deleteIdea(@Param('id') id: string, @User('id') user){
        this.logData({id, user});        
        return this.ideaService.deleteIdea(id, user);
    }
    
    @Post(':id/upvote')
    @UseGuards(new AuthGuard)
    upvoteIdea(@Param('id') id: string, @User('id') userId: string){
        this.logData({ id, userId })
        return  this.ideaService.upvote(id, userId);
    }    

    @Post(':id/downvote')
    @UseGuards(new AuthGuard)
    downvoteIdea(@Param('id') id: string, @User('id') userId: string){
        this.logData({ id, userId })
        return  this.ideaService.downvote(id, userId);
    }

    @Post(':id/boomark')
    @UseGuards(new AuthGuard)
    bookmarkIdea(@Param('id') id: string, @User('id') user: string){
        this.logData({ id, user})
        return this.ideaService.bookmar(id, user);
    }

    @Delete(':id/boomark')
    @UseGuards(new AuthGuard)
    unbookmarkIdea(@Param('id') id: string, @User('id') user: string){
        this.logData({ id, user})
        return this.ideaService.unbookmark(id, user);    
    }
}