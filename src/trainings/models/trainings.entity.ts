import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,JoinColumn } from "typeorm";
import { User } from "../../users/models/user.entity";
import { Workout } from "../../workouts/models/workouts.entity";

@Entity()
export class TrainingSession {
    @PrimaryGeneratedColumn()
    sessionId: number;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'userId' }) 
    user: User;

    @ManyToOne(type => Workout)
    @JoinColumn({ name: 'workoutId' }) 
    workout: Workout;

    @Column("json")
    exerciseMetrics: {
        exerciseID: number,
        metrics: {
            set: number,
            weight: number,
            reps: number
        }[]
    }[];
}

