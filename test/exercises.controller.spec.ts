import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesController } from '../src/exercises/exercises.controller';
import { ExercisesService } from '../src/exercises/exercises.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from '../src/exercises/models/exercises.entity';
import { NotFoundException } from '@nestjs/common';

describe('ExercisesController', () => {
  let controller: ExercisesController;
  let service: ExercisesService;
  let repository: Repository<Exercise>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExercisesController],
      providers: [
        ExercisesService,
        {
          provide: getRepositoryToken(Exercise),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<ExercisesController>(ExercisesController);
    service = module.get<ExercisesService>(ExercisesService);
    repository = module.get<Repository<Exercise>>(getRepositoryToken(Exercise));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of exercises', async () => {
      const result: Exercise[] = [{ id: 1, name: 'Exercise 1' } as Exercise];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });

  });

  describe('findOne', () => {
    it('should return a single exercise', async () => {
      const result: Exercise = { id: 1, name: 'Exercise 1' } as Exercise;
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(1)).toBe(result);
    });

    it('should throw NotFoundException for non-existing exercise', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.findOne(999)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new exercise', async () => {
      const exercise: Exercise = { id: 1, name: 'New Exercise' } as Exercise;
      jest.spyOn(service, 'create').mockResolvedValue(exercise);

      const result = await controller.create(exercise);

      expect(result).toBe(exercise);
    });

  });

  describe('update', () => {
    it('should update an existing exercise', async () => {
      const updateData: Exercise = { name: 'Updated Exercise' } as Exercise;
      jest
        .spyOn(service, 'update')
        .mockResolvedValue({ message: 'Exercise updated successfully' });

      const result = await controller.update(1, updateData);

      expect(result).toEqual({ message: 'Exercise updated successfully' });
    });

    it('should throw NotFoundException for updating a non-existing exercise', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      await expect(
        controller.update(999, {} as Exercise),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an existing exercise', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue({ id: 1, name: 'Exercise 1' } as Exercise);
      jest
        .spyOn(service, 'delete')
        .mockResolvedValue({ message: 'Exercise deleted successfully' });

      const result = await controller.delete(1);

      expect(result).toEqual({ message: 'Exercise deleted successfully' });
    });

    it('should throw NotFoundException for deleting a non-existing exercise', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.delete(999)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
