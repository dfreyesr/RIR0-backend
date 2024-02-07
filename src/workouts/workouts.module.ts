import { Module } from '@nestjs/common';
import { WorkoutsController } from './workouts.controller';
import { WorkoutService } from './workouts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workout } from './models/workouts.entity';
import { Exercise } from '../exercises/models/exercises.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workout, Exercise])],
  controllers: [WorkoutsController],
  providers: [WorkoutService],
  exports: [WorkoutService],
})
export class WorkoutsModule {}
