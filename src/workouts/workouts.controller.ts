import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { WorkoutService } from './workouts.service';
import { Workout } from './models/workouts.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/workouts')
@UseGuards(JwtAuthGuard)
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutService) {}

  @Get()
  async findAll(): Promise<Workout[]> {
    return this.workoutsService.findAll();
  }

  @Post()
  @HttpCode(201)
  async create(
    @Body()
    workoutData: {
      name: string;
      img: string;
      description: string;
      exercisesIds: number[];
    },
  ): Promise<Workout> {
    const createdWorkout = await this.workoutsService.create(workoutData);
    return createdWorkout;
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body()
    workoutData: {
      name?: string;
      img?: string;
      description?: string;
      exercisesIds?: number[];
    },
  ): Promise<any> {
    await this.workoutsService.update(id, workoutData);
    return { message: 'Workout updated successfully' };
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<any> {
    const workout = await this.workoutsService.findOne(id);
    if (!workout) {
      throw new NotFoundException('Workout does not exist!');
    }
    await this.workoutsService.delete(id);
    return { message: 'Workout deleted successfully' };
  }
}
