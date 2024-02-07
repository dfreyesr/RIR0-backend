import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Type } from 'class-transformer';
import { TrainingSessionService } from './trainings.service';
import { TrainingSession } from './models/trainings.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsArray, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { UsersService } from 'src/users/users.service';
import { WorkoutService } from 'src/workouts/workouts.service';

class MetricDTO {
  @IsNumber()
  set: number;

  @IsNumber()
  weight: number;

  @IsNumber()
  reps: number;
}

class ExerciseMetricDTO {
  @IsNumber()
  exerciseID: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MetricDTO) // Correct usage
  metrics: MetricDTO[];
}

class CreateTrainingSessionDTO {
  @IsObject()
  user: { userId: number };

  @IsObject()
  workout: { workoutId: number };

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseMetricDTO)
  exerciseMetrics: ExerciseMetricDTO[];
}

@Controller('api/training-session')
@UseGuards(JwtAuthGuard)
export class TrainingSessionController {
  constructor(
    private readonly trainingSessionService: TrainingSessionService,
    private readonly usersService: UsersService,
    private readonly workoutService: WorkoutService,
  ) {}

  @Post()
  async create(@Body() trainingSessionDTO: CreateTrainingSessionDTO) {
    const newTrainingSession = await this.transformDtoToEntity(
      trainingSessionDTO,
    );
    return this.trainingSessionService.create(newTrainingSession);
  }

  private async transformDtoToEntity(
    dto: CreateTrainingSessionDTO,
  ): Promise<TrainingSession> {
    const user = await this.usersService.findOne(dto.user.userId);
    const workout = await this.workoutService.findOne(dto.workout.workoutId);

    const trainingSession = new TrainingSession();
    trainingSession.user = user;
    trainingSession.workout = workout;
    trainingSession.exerciseMetrics = dto.exerciseMetrics;

    return trainingSession;
  }

  @Get()
  async getAll() {
    return this.trainingSessionService.getAll();
  }

  @Get(':userId')
  async getByUserId(@Param('userId') userId: number) {
    return this.trainingSessionService.getByUserId(userId);
  }

  @Delete(':sessionId')
  async delete(@Param('sessionId') sessionId: number) {
    return this.trainingSessionService.delete(sessionId);
  }

  @Get('user/:userId/metrics')
  async getUserMetrics(@Param('userId', ParseIntPipe) userId: number) {
    return this.trainingSessionService.getUserMetrics(userId);
  }
}
