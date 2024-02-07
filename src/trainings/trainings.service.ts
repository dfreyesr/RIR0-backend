import { Injectable } from "@nestjs/common";
import { Repository, Between } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { TrainingSession } from "./models/trainings.entity";
import { User } from "../users/models/user.entity";
import { subMonths, endOfMonth } from 'date-fns';

@Injectable()
export class TrainingSessionService {

    constructor(
        @InjectRepository(TrainingSession)
        private readonly trainingSessionRepository: Repository<TrainingSession>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(trainingSession: TrainingSession) {
        return await this.trainingSessionRepository.save(trainingSession);
    }

    async getAll() {
        return await this.trainingSessionRepository
            .createQueryBuilder('trainingSession')
            .leftJoinAndSelect('trainingSession.user', 'user')
            .leftJoinAndSelect('trainingSession.workout', 'workout')
            .getMany();
    }
    

    async getByUserId(userId: number) {
        const sessions = await this.trainingSessionRepository
            .createQueryBuilder('trainingSession')
            .leftJoinAndSelect('trainingSession.user', 'user')
            .leftJoinAndSelect('trainingSession.workout', 'workout')
            .where('user.id = :userId', { userId })
            .getMany();
    
        return sessions;
    }

    async delete(sessionId: number) {
        return await this.trainingSessionRepository.delete(sessionId);
    }
    

    async getUserMetrics(userId: number) {
        const sessions = await this.trainingSessionRepository
            .createQueryBuilder('trainingSession')
            .leftJoinAndSelect('trainingSession.user', 'user')
            .leftJoinAndSelect('trainingSession.workout', 'workout')
            .where('user.id = :userId', { userId })
            .getMany();
    
        let totalWeight = 0;
        let totalReps = 0;
        let totalSets = 0;
    
        const metrics = sessions.flatMap((session) =>
            session.exerciseMetrics.flatMap((exerciseMetric) =>
                exerciseMetric.metrics.map((metric) => {
                    totalWeight += metric.weight;
                    totalReps += metric.reps;
                    totalSets += metric.set;
    
                    return {
                        exerciseId: exerciseMetric.exerciseID,
                        set: metric.set,
                        weight: metric.weight,
                        reps: metric.reps,
                    };
                })
            )
        );
    
        return {
            metrics,
            totalWeight,
            totalReps,
            totalSets,
        };
    }
    

    
}
