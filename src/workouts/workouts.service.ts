import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workout } from './models/workouts.entity';
import { Exercise } from '../exercises/models/exercises.entity';

@Injectable()
export class WorkoutService {
  constructor(
    @InjectRepository(Workout)
    private workoutRepo: Repository<Workout>,
    @InjectRepository(Exercise)
    private exerciseRepo: Repository<Exercise>,
  ) {}

  async findAll(): Promise<Workout[]> {
    return this.workoutRepo.find({ relations: ['exercises'] });
  }

  async findOne(id: number): Promise<Workout> {
    return this.workoutRepo.findOne({
      where: { id },
      relations: ['exercises'],
    });
  }

  async update(
    id: number,
    workoutData: {
      name?: string;
      img?: string;
      description?: string;
      exercisesIds?: number[];
    },
  ): Promise<Workout> {
    const { exercisesIds, ...workoutInfo } = workoutData;
    const workout = await this.workoutRepo.findOneOrFail({
      where: { id },
      relations: ['exercises'],
    });
    const exercises = exercisesIds
      ? await this.exerciseRepo.findByIds(exercisesIds)
      : workout.exercises;

    Object.assign(workout, workoutInfo);
    workout.exercises = exercises;
    return this.workoutRepo.save(workout);
  }

  async create(workoutData: {
    name: string;
    img: string;
    description: string;
    exercisesIds: number[];
  }): Promise<Workout> {
    const { exercisesIds, ...workoutInfo } = workoutData;
    const exercises = await this.exerciseRepo.findByIds(exercisesIds);
    const workout = this.workoutRepo.create(workoutInfo);
    workout.exercises = exercises;
    return this.workoutRepo.save(workout);
  }

  async delete(id: number): Promise<void> {
    await this.workoutRepo.delete(id);
  }
}
