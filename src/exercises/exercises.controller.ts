import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, HttpCode, UseGuards } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { Exercise } from './models/exercises.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get()
  @UseGuards(JwtAuthGuard) 
  async findAll(): Promise<Exercise[]> {
    return this.exercisesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard) 
  async findOne(@Param('id') id: number): Promise<Exercise> {
    const Exercise = await this.exercisesService.findOne(id);
    if (!Exercise) {
      throw new NotFoundException('Exercise does not exist!');
    }
    return Exercise;
  }

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard) 
  async create(@Body() exercise: Exercise): Promise<Exercise> {
    const createdExercise = await this.exercisesService.create(exercise);
    return createdExercise;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard) 
  async update(@Param('id') id: number, @Body() exercise: Exercise): Promise<any> {
    await this.exercisesService.update(id, exercise);
    return { message: 'Exercise updated successfully' };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) 
  async delete(@Param('id') id: number): Promise<any> {
    const Exercise = await this.exercisesService.findOne(id);
    if (!Exercise) {
      throw new NotFoundException('Exercise does not exist!');
    }
    await this.exercisesService.delete(id);
    return { message: 'Exercise deleted successfully' };
  }
}
