import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/models/user.entity';
import { Exercise } from '../exercises/models/exercises.entity';
import { Workout } from '../workouts/models/workouts.entity';
import { TrainingSession } from '../trainings/models/trainings.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User,Exercise,Workout,TrainingSession],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
