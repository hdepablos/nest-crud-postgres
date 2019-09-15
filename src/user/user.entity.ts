import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { UserRO } from './user.dto';
import { IdeaEntity } from './../idea/idea.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({
    type: 'text',
    unique: true,
  })
  username: string;

  @Column('text')
  password: string;

  @OneToMany(type => IdeaEntity, idea => idea.author)
  ideas: IdeaEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  toResponseObject(showToken: boolean = true): UserRO {
    const { id, created, username, token } = this;
    const responseObject: any = {
      id,
      created,
      username,
    };

    if (showToken) {
      responseObject.token = token;
    }

    if(this.ideas){
      responseObject.ideas = this.ideas;
    }
    return responseObject;
  }

  private get token(): string {
    const { id, username } = this;

    return jwt.sign(
      {
        id,
        username,
      },
      process.env.SECRET,
      { expiresIn: '7d' },
    );
  }
}
