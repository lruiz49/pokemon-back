import { Test } from '@nestjs/testing';
import { AbilityService } from '../../../src/ability/service/ability.service';
import { AbilityRepository } from '../../../src/ability/repository/ability.repository';
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

function setup() {
  const repoMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  return Test.createTestingModule({
    providers: [
      AbilityService,
      { provide: AbilityRepository, useValue: repoMock },
    ],
  })
    .compile()
    .then((m) => ({
      service: m.get(AbilityService),
      repo: m.get(AbilityRepository),
    }));
}

describe('AbilityService', () => {
  let service: AbilityService;
  let repo: any;

  beforeEach(async () => {
    ({ service, repo } = await setup());
  });

  afterEach(() => jest.clearAllMocks());

  describe('getAllAbilities', () => {
    it('should return all abilities', async () => {
      const mockAbilities = [makeAbility({ name: 'Static' })];
      repo.find.mockResolvedValue(mockAbilities);

      const result = await service.getAllAbilities();

      expect(result).toEqual(mockAbilities);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('getAbilityById', () => {
    it('should return ability by id', async () => {
      const mockAbility = makeAbility({ id: 42, name: 'Levitate' });
      repo.findOne.mockResolvedValue(mockAbility);

      const result = await service.getAbilityById(42);

      expect(result).toEqual(mockAbility);
      expect(repo.findOne).toHaveBeenCalledWith(42);
    });
  });

  describe('createAbility', () => {
    it('should create and return new ability', async () => {
      const createDto: CreateAbilityDto = {
        name: 'Overgrow',
        description: 'Powers up Grass-type moves',
      };
      const mockAbility = makeAbility({ id: 10, ...createDto });
      repo.create.mockResolvedValue(mockAbility);

      const result = await service.createAbility(createDto);

      expect(result).toEqual(mockAbility);
      expect(repo.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('updateAbility', () => {
    it('should update and return updated ability', async () => {
      const updateDto: UpdateAbilityDto = { name: 'Lightning Rod' };
      const mockAbility = makeAbility({ id: 10, name: 'Lightning Rod' });
      repo.update.mockResolvedValue(mockAbility);

      const result = await service.updateAbility(10, updateDto);

      expect(result).toEqual(mockAbility);
      expect(repo.update).toHaveBeenCalledWith(10, updateDto);
    });
  });

  describe('deleteAbility', () => {
    it('should delete and return deleted ability', async () => {
      const mockAbility = makeAbility({ id: 7, name: 'Static' });
      repo.delete.mockResolvedValue(mockAbility);

      const result = await service.deleteAbility(7);

      expect(result).toEqual(mockAbility);
      expect(repo.delete).toHaveBeenCalledWith(7);
    });
  });
});
