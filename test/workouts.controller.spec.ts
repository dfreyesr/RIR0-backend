import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutsController } from '../src/workouts/workouts.controller';
import { WorkoutService } from '../src/workouts/workouts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workout } from '../src/workouts/models/workouts.entity';
import { NotFoundException } from '@nestjs/common';

describe('WorkoutsController', () => {
  let controller: WorkoutsController;
  let service: WorkoutService;
  let repository: Repository<Workout>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutsController],
      providers: [
        WorkoutService,
        {
          provide: getRepositoryToken(Workout),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<WorkoutsController>(WorkoutsController);
    service = module.get<WorkoutService>(WorkoutService);
    repository = module.get<Repository<Workout>>(getRepositoryToken(Workout));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of workouts', async () => {
      const result: Workout[] = [{ id: 1 } as Workout];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });

  });

  describe('create', () => {
    it('should create a new workout', async () => {
      const workoutData: any = { name: 'New Workout' };
      const workout: Workout = { id: 1, ...workoutData } as Workout;
      jest.spyOn(service, 'create').mockResolvedValue(workout);

      const result = await controller.create(workoutData);

      expect(result).toBe(workout);
    });

  });

  describe('update', () => {
    it('should update an existing workout', async () => {
      const updateData: any = { name: 'Updated Workout' };
      jest.spyOn(service, 'update').mockResolvedValue({ message: 'Workout updated successfully' });

      const result = await controller.update('1', updateData);

      expect(result).toEqual({ message: 'Workout updated successfully' });
    });

    it('should throw NotFoundException for updating a non-existing workout', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      await expect(controller.update('999', {})).rejects.toThrowError(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an existing workout', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue({ message: 'Workout deleted successfully' });

      const result = await controller.delete('1');

      expect(result).toEqual({ message: 'Workout deleted successfully' });
    });

    it('should throw NotFoundException for deleting a non-existing workout', async () => {
      jest.spyOn(service, 'delete').mockRejectedValue(new NotFoundException());

      await expect(controller.delete('999')).rejects.toThrowError(NotFoundException);
    });
  });
});