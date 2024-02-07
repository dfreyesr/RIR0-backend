import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ExercisesModule } from './exercises/exercises.module';
import { WorkoutsModule } from './workouts/workouts.module';
import { DatabaseModule } from './database/database.module';
import { TrainingsModule } from './trainings/trainings.module';
import {JwtStrategy  } from './auth/jwt-strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    PassportModule,
    JwtModule.register({
      secret: 'secreto', 
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    ExercisesModule,
    WorkoutsModule,
    DatabaseModule,
    TrainingsModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy], 
})
export class AppModule {}
