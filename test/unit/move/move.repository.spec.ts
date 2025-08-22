import { Test } from '@nestjs/testing';
import { MoveRepository } from '../../../src/move/repository/move.repository';
import { PrismaService } from '../../../src/prisma/prisma.service';
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

describe('MoveRepository', () => {
  let repository: MoveRepository;
  let prisma: any;

  beforeEach(async () => {
    const prismaMock = {
      move: {
        findMany: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        MoveRepository,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    repository = moduleRef.get(MoveRepository);
    prisma = moduleRef.get(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('find', () => {
    it('should return all moves', async () => {
      const mockMoves = [makeMove({ name: 'Thunderbolt' })];
      prisma.move.findMany.mockResolvedValue(mockMoves);

      const result = await repository.find();

      expect(result).toEqual(mockMoves);
      expect(prisma.move.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a move by id', async () => {
      const mockMove = makeMove({ id: 1, name: 'Thunderbolt' });
      prisma.move.findUniqueOrThrow.mockResolvedValue(mockMove);

      const result = await repository.findOne(1);

      expect(result).toEqual(mockMove);
      expect(prisma.move.findUniqueOrThrow).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('create', () => {
    it('should create and return a new move', async () => {
      const createDto: CreateMoveDto = {
        name: 'Solar Beam',
        description: 'Two-turn Grass attack',
        type: Type.GRASS,
        category: MoveCategory.SPECIAL,
      };
      const mockMove = makeMove({ id: 2, ...createDto });
      prisma.move.create.mockResolvedValue(mockMove);

      const result = await repository.create(createDto);

      expect(result).toEqual(mockMove);
      expect(prisma.move.create).toHaveBeenCalledWith({ data: createDto });
    });
  });

  describe('update', () => {
    it('should update and return the updated move', async () => {
      const updateDto: UpdateMoveDto = { name: 'Thunder' };
      const mockMove = makeMove({ id: 1, name: 'Thunder' });
      prisma.move.update.mockResolvedValue(mockMove);

      const result = await repository.update(1, updateDto);

      expect(result).toEqual(mockMove);
      expect(prisma.move.update).toHaveBeenCalledWith({ 
        where: { id: 1 }, 
        data: updateDto 
      });
    });
  });

  describe('delete', () => {
    it('should delete and return the deleted move', async () => {
      const mockMove = makeMove({ id: 1, name: 'Thunderbolt' });
      prisma.move.delete.mockResolvedValue(mockMove);

      const result = await repository.delete(1);

      expect(result).toEqual(mockMove);
      expect(prisma.move.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('findByType', () => {
    it('should return moves filtered by type', async () => {
      const mockMoves = [makeMove({ type: Type.ELECTRIC, name: 'Thunderbolt' })];
      prisma.move.findMany.mockResolvedValue(mockMoves);

      const result = await repository.findByType(Type.ELECTRIC);

      expect(result).toEqual(mockMoves);
      expect(prisma.move.findMany).toHaveBeenCalledWith({ 
        where: { type: Type.ELECTRIC } 
      });
    });
  });

  describe('findByCategory', () => {
    it('should return moves filtered by category', async () => {
      const mockMoves = [makeMove({ category: MoveCategory.SPECIAL, name: 'Thunderbolt' })];
      prisma.move.findMany.mockResolvedValue(mockMoves);

      const result = await repository.findByCategory(MoveCategory.SPECIAL);

      expect(result).toEqual(mockMoves);
      expect(prisma.move.findMany).toHaveBeenCalledWith({ 
        where: { category: MoveCategory.SPECIAL } 
      });
    });
  });
});
