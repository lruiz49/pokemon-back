import { Test } from '@nestjs/testing';
import { AbilityRepository } from '../../../src/ability/repository/ability.repository';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { CreateAbilityDto, UpdateAbilityDto, AbilityDto } from '../../../src/ability/dto/ability.dto';

function makeAbility(overrides: Partial<any> = {}) {
  const now = new Date();
  return {
    id: 1,
    name: 'Static',
    description: 'Prevents paralysis',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('AbilityRepository', () => {
  let repository: AbilityRepository;
  let prisma: any;

  beforeEach(async () => {
    const prismaMock = {
      ability: {
        findMany: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AbilityRepository,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    repository = moduleRef.get(AbilityRepository);
    prisma = moduleRef.get(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('find', () => {
    it('should return all abilities', async () => {
      const mockAbilities = [makeAbility({ name: 'Static' })];
      prisma.ability.findMany.mockResolvedValue(mockAbilities);

      const result = await repository.find();

      expect(result).toEqual(mockAbilities);
      expect(prisma.ability.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an ability by id', async () => {
      const mockAbility = makeAbility({ id: 1, name: 'Static' });
      prisma.ability.findUniqueOrThrow.mockResolvedValue(mockAbility);

      const result = await repository.findOne(1);

      expect(result).toEqual(mockAbility);
      expect(prisma.ability.findUniqueOrThrow).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('create', () => {
    it('should create and return a new ability', async () => {
      const createDto: CreateAbilityDto = {
        name: 'Overgrow',
        description: 'Powers up Grass-type moves',
      };
      const mockAbility = makeAbility({ id: 2, ...createDto });
      prisma.ability.create.mockResolvedValue(mockAbility);

      const result = await repository.create(createDto);

      expect(result).toEqual(mockAbility);
      expect(prisma.ability.create).toHaveBeenCalledWith({ data: createDto });
    });
  });

  describe('update', () => {
    it('should update and return the updated ability', async () => {
      const updateDto: UpdateAbilityDto = { name: 'Lightning Rod' };
      const mockAbility = makeAbility({ id: 1, name: 'Lightning Rod' });
      prisma.ability.update.mockResolvedValue(mockAbility);

      const result = await repository.update(1, updateDto);

      expect(result).toEqual(mockAbility);
      expect(prisma.ability.update).toHaveBeenCalledWith({ 
        where: { id: 1 }, 
        data: updateDto 
      });
    });
  });

  describe('delete', () => {
    it('should delete and return the deleted ability', async () => {
      const mockAbility = makeAbility({ id: 1, name: 'Static' });
      prisma.ability.delete.mockResolvedValue(mockAbility);

      const result = await repository.delete(1);

      expect(result).toEqual(mockAbility);
      expect(prisma.ability.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
