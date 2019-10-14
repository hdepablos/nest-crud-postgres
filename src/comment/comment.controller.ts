import { Controller, Get, Param, Post, UseGuards, UsePipes, ValidationPipe, Body, Delete, Query } from '@nestjs/common';
import { AuthGuard } from './../shared/auth.guard';
import { User } from './../user/user.decorator';
import { CommentDto } from './comment.dto';
import { CommentService } from './comment.service';

@Controller('api/comments')
export class CommentController {

    constructor(private commentService: CommentService){}

    @Get('idea/:id')
    showCommentsByIdea(@Param('id') idea: string){
        return this.commentService.showByIdea(idea);
    }

    @Get('user/:id')
    showCommentsByUser(@Param('id') userId: string, @Query('page') page: number){
        return this.commentService.showByUser(userId, page );
    }

    @Get(':id')
    showComment(@Param('id') id: string){
        return this.commentService.showComment(id);
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    deleteComment(@Param('id') id: string, @User('Id') userId: string){
        return this.commentService.deleteComment(id, userId);        
    }

    @Post('idea/:id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    createComment(@Param('id') idea: string, @User('id') userId: string, @Body() data: CommentDto){
        return this.commentService.create(idea, userId, data);
    }
    
}
