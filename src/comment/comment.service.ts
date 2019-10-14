import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { Repository } from 'typeorm';
import { IdeaEntity } from './../idea/idea.entity';
import { UserEntity } from './../user/user.entity';
import { CommentDto } from './comment.dto';

@Injectable()
export class CommentService {

    constructor(
        @InjectRepository(CommentEntity) private commentReposity: Repository<CommentEntity>,
        @InjectRepository(IdeaEntity) private ideaReposity: Repository<IdeaEntity>,
        @InjectRepository(UserEntity) private userReposity: Repository<UserEntity>
    ) {
    }

    private toResponseObject(comment: CommentEntity){
        const toResponseObject: any = comment;

        if(comment.author){
            toResponseObject.author = comment.author.toResponseObject();
        }

        return toResponseObject();
    }


    // Consultar idea
    async showByIdea(id: string) {
        // Una idea que tiene muchos comentarios con sus autor
        const idea = await this.ideaReposity.findOne({
            where: { id },
            relations: ['comments', 'comments.author', 'comments.idea']
        })

        // Por cada comentarios que tiene la idea, formatear la respuesta
        return idea.comments.map(comment => this.toResponseObject(comment));
    }

    // Consultar Usuario
    async showByUser(id: string, page: number = 1) {
        // El usuario con todos los comentarios que el ha realizado con el autor de la idea
        const comments = await this.commentReposity.find({
            where: { id },
            relations: ['author'],
            take: 25,
            skip: 25 * (page - 1)
        })

        // Por cada comentario formatea la salida del comentario
        return comments.map(comment => this.toResponseObject(comment));

    }


    async showComment(id: string) {
        const comment = await this.commentReposity.findOne({
            where: { id },
            relations: ['author', 'idea']
        });

        return this.toResponseObject(comment);
    }

    async create(ideaId: string, userId: string, data: CommentDto) {
        const idea = await this.ideaReposity.findOne({
            where: { id: ideaId },
        });
        const user = await this.userReposity.findOne({ where: { id: userId } });

        const comment = await this.commentReposity.create(({
            ...data,
            idea,
            author: user
        }));

        await this.commentReposity.save(comment);

        return this.toResponseObject(comment);
    }

    async deleteComment(id: string, userId: string) {
        const comment = await this.commentReposity.findOne({
            where: { id },
            relations: ['author', 'idea']
        });

        if (comment.author.id !== userId) {
            throw new HttpException('You do not own this comment', HttpStatus.UNAUTHORIZED);
        }

        await this.commentReposity.remove(comment);

        return this.toResponseObject(comment);
    }

}
