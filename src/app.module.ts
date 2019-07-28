import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdeaModule } from './idea/idea.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: (process.env.LOCALHOSTDBPG || 'localhost'),
      port: parseInt(process.env.PORTDBPG || '5432'),
      username: (process.env.USERNAMEDBPG || 'postgres'),
      password: (process.env.PASSWORDDBPG || '123456'),
      database: (process.env.NAMEDBPG || 'ideas'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true
    }),
    IdeaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
