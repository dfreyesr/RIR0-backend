import { Module } from '@nestjs/common';
import { TrainingSessionController } from './trainings.controller';
import { TrainingSessionService } from './trainings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingSession } from './models/trainings.entity';
import { Exercise } from '../exercises/models/exercises.entity';
import { Workout } from '../workouts/models/workouts.entity';
import { User } from '../users/models/user.entity';
import { UsersModule } from 'src/users/users.module';
import { WorkoutsModule } from 'src/workouts/workouts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrainingSession, Workout, Exercise, User]),
    UsersModule,
    WorkoutsModule,
  ],
  controllers: [TrainingSessionController],
  providers: [TrainingSessionService],
})
export class TrainingsModule {}
