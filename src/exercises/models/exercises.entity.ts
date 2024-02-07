import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Workout } from '../../workouts/models/workouts.entity';

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: false })
  image: string;

  @Column()
  description: string;

  @ManyToMany(() => Workout, (workout) => workout.exercises)
  @JoinTable()
  workouts: Workout[];
}
