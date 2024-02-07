import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Exercise} from './models/exercises.entity';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private exerciseRepo: Repository<Exercise>,
  ) {}

  async findAll(): Promise<Exercise[]> {
    return this.exerciseRepo.find();
  }

  async findOne(id: number): Promise<Exercise> {
    return this.exerciseRepo.findOne({ where: { id } });
  }

  async create(exercise: Partial<Exercise>): Promise<Exercise> {
    const newexercise = this.exerciseRepo.create(exercise);
    return this.exerciseRepo.save(newexercise);
  }

  async update(id: number, exercise: Partial<Exercise>): Promise<Exercise> {
    await this.exerciseRepo.update(id, exercise);
    return this.exerciseRepo.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.exerciseRepo.delete(id);
  }
}