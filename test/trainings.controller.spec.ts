import { Test, TestingModule } from '@nestjs/testing';
import { TrainingSessionController } from '../src/trainings/trainings.controller';
import { TrainingSessionService } from '../src/trainings/trainings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainingSession } from '../src/trainings/models/trainings.entity';
import { NotFoundException } from '@nestjs/common';

describe('TrainingSessionController', () => {
  let controller: TrainingSessionController;
  let service: TrainingSessionService;
  let repository: Repository<TrainingSession>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainingSessionController],
      providers: [
        TrainingSessionService,
        {
          provide: getRepositoryToken(TrainingSession),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<TrainingSessionController>(TrainingSessionController);
    service = module.get<TrainingSessionService>(TrainingSessionService);
    repository = module.get<Repository<TrainingSession>>(getRepositoryToken(TrainingSession));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new training session', async () => {
      const session: TrainingSession = {
        sessionId: 1,
        user: {} as any, 
        workout: {} as any, 
        exerciseMetrics: [],
      };
      jest.spyOn(service, 'create').mockResolvedValue(session);

      const result = await controller.create(session);

      expect(result).toBe(session);
    });

  });

  describe('getAll', () => {
    it('should return an array of training sessions', async () => {
      const result: TrainingSession[] = [{ sessionId: 1 } as TrainingSession];
      jest.spyOn(service, 'getAll').mockResolvedValue(result);

      expect(await controller.getAll()).toBe(result);
    });

  });

  describe('getByUserId', () => {
    it('should return training sessions for a specific user', async () => {
      const result: TrainingSession[] = [{ sessionId: 1 } as TrainingSession];
      jest.spyOn(service, 'getByUserId').mockResolvedValue(result);

      expect(await controller.getByUserId('1')).toBe(result);
    });

    it('should throw NotFoundException for non-existing user', async () => {
      jest.spyOn(service, 'getByUserId').mockRejectedValue(new NotFoundException());

      await expect(controller.getByUserId(999)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a training session', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue({ message: 'Training session deleted successfully' });

      const result = await controller.delete('1');

      expect(result).toEqual({ message: 'Training session deleted successfully' });
    });

    it('should throw NotFoundException for deleting a non-existing training session', async () => {
      jest.spyOn(service, 'delete').mockRejectedValue(new NotFoundException());

      await expect(controller.delete(999)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('getUserMetrics', () => {
    it('should return user metrics for a specific user', async () => {
      const result: any[] = []; 
      jest.spyOn(service, 'getUserMetrics').mockResolvedValue(result);

      expect(await controller.getUserMetrics(1)).toBe(result);
    });

    it('should throw NotFoundException for non-existing user metrics', async () => {
      jest.spyOn(service, 'getUserMetrics').mockRejectedValue(new NotFoundException());

      await expect(controller.getUserMetrics(999)).rejects.toThrowError(NotFoundException);
    });
  });
});