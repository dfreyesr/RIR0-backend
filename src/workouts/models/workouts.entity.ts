import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Exercise } from '../../exercises/models/exercises.entity';

@Entity()
export class Workout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  img: string;

  @Column()
  description: string;

  @ManyToMany(() => Exercise, (exercise) => exercise.workouts)
  @JoinTable()
  exercises: Exercise[];
}
