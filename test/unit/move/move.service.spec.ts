import { Test } from '@nestjs/testing';
import { MoveService } from '../../../src/move/service/move.service';
import { MoveRepository } from '../../../src/move/repository/move.repository';
import { CreateMoveDto, UpdateMoveDto, MoveDto } from '../../../src/move/dto/move.dto';
import { MoveCategory, Type } from '@prisma/client';

function makeMove(overrides: Partial<any> = {}) {
  const now = new Date();
  return {
    id: 1,
    name: 'Thunderbolt',
    description: 'Electric attack',
    type: Type.ELECTRIC,
    category: MoveCategory.SPECIAL,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function setup() {
  const repoMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByType: jest.fn(),
    findByCategory: jest.fn(),
  };

  return Test.createTestingModule({
    providers: [
      MoveService,
      { provide: MoveRepository, useValue: repoMock },
    ],
  })
    .compile()
    .then((m) => ({
      service: m.get(MoveService),
      repo: m.get(MoveRepository),
    }));
}

describe('MoveService', () => {
  let service: MoveService;
  let repo: any;

  beforeEach(async () => {
    ({ service, repo } = await setup());
  });

  afterEach(() => jest.clearAllMocks());

  describe('getAllMoves', () => {
    it('should return all moves', async () => {
      const mockMoves = [makeMove({ name: 'Thunderbolt' })];
      repo.find.mockResolvedValue(mockMoves);

      const result = await service.getAllMoves();

      expect(result).toEqual(mockMoves);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('getMoveById', () => {
    it('should return move by id', async () => {
      const mockMove = makeMove({ id: 42, name: 'Surf' });
      repo.findOne.mockResolvedValue(mockMove);

      const result = await service.getMoveById(42);

      expect(result).toEqual(mockMove);
      expect(repo.findOne).toHaveBeenCalledWith(42);
    });
  });

  describe('createMove', () => {
    it('should create and return new move', async () => {
      const createDto: CreateMoveDto = {
        name: 'Solar Beam',
        description: 'Two-turn Grass attack',
        type: Type.GRASS,
        category: MoveCategory.SPECIAL,
      };
      const mockMove = makeMove({ id: 10, ...createDto });
      repo.create.mockResolvedValue(mockMove);

      const result = await service.createMove(createDto);

      expect(result).toEqual(mockMove);
      expect(repo.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('updateMove', () => {
    it('should update and return updated move', async () => {
      const updateDto: UpdateMoveDto = { name: 'Thunder' };
      const mockMove = makeMove({ id: 10, name: 'Thunder' });
      repo.update.mockResolvedValue(mockMove);

      const result = await service.updateMove(10, updateDto);

      expect(result).toEqual(mockMove);
      expect(repo.update).toHaveBeenCalledWith(10, updateDto);
    });
  });

  describe('deleteMove', () => {
    it('should delete and return deleted move', async () => {
      const mockMove = makeMove({ id: 7, name: 'Thunderbolt' });
      repo.delete.mockResolvedValue(mockMove);

      const result = await service.deleteMove(7);

      expect(result).toEqual(mockMove);
      expect(repo.delete).toHaveBeenCalledWith(7);
    });
  });

  describe('getAllByType', () => {
    it('should return moves filtered by type', async () => {
      const mockMoves = [makeMove({ type: Type.ELECTRIC, name: 'Thunderbolt' })];
      repo.findByType.mockResolvedValue(mockMoves);

      const result = await service.getAllByType(Type.ELECTRIC);

      expect(result).toEqual(mockMoves);
      expect(repo.findByType).toHaveBeenCalledWith(Type.ELECTRIC);
    });
  });

  describe('getAllByCategory', () => {
    it('should return moves filtered by category', async () => {
      const mockMoves = [makeMove({ category: MoveCategory.SPECIAL, name: 'Thunderbolt' })];
      repo.findByCategory.mockResolvedValue(mockMoves);

      const result = await service.getAllByCategory(MoveCategory.SPECIAL);

      expect(result).toEqual(mockMoves);
      expect(repo.findByCategory).toHaveBeenCalledWith(MoveCategory.SPECIAL);
    });
  });
});
