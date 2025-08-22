import { Test } from '@nestjs/testing';
import { PokemonRepository } from '../../../src/pokemon/repository/pokemon.repository';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { Type } from '@prisma/client';
import { CreatePokemonDto, UpdatePokemonDto, PaginatedResponseDto, PokemonDto } from '../../../src/pokemon/dto/pokemon.dto';

function makePokemon(overrides: Partial<any> = {}) {
  const now = new Date();
  return {
    id: 1,
    name: 'Defaultmon',
    description: 'Default desc',
    type1: Type.ELECTRIC,
    type2: null,
    height: 100,
    weight: 10,
    imageUrl: 'http://example.com.png',
    abilityId: null,
    moveIds: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('PokemonRepository', () => {
  let repository: PokemonRepository;
  let prisma: any;

  beforeEach(async () => {
    const prismaMock = {
      pokemon: {
        findMany: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        PokemonRepository,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    repository = moduleRef.get(PokemonRepository);
    prisma = moduleRef.get(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findOne', () => {
    it('should return a pokemon by id', async () => {
      const mockPokemon = makePokemon({ id: 1, name: 'Pikachu' });
      prisma.pokemon.findUniqueOrThrow.mockResolvedValue(mockPokemon);

      const result = await repository.findOne(1);

      expect(result).toEqual(mockPokemon);
      expect(prisma.pokemon.findUniqueOrThrow).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('create', () => {
    it('should create and return a new pokemon', async () => {
      const createDto: CreatePokemonDto = {
        name: 'Bulbasaur',
        description: 'Seed Pokemon',
        type1: Type.GRASS,
        type2: Type.POISON,
        height: 70,
        weight: 6.9,
        imageUrl: 'http://example.com/bulbasaur.png',
        abilityId: 1,
        moveIds: [1, 2],
      };
      const mockPokemon = makePokemon({ id: 2, ...createDto });
      prisma.pokemon.create.mockResolvedValue(mockPokemon);

      const result = await repository.create(createDto);

      expect(result).toEqual(mockPokemon);
      expect(prisma.pokemon.create).toHaveBeenCalledWith({ data: createDto });
    });
  });

  describe('update', () => {
    it('should update and return the updated pokemon', async () => {
      const updateDto: UpdatePokemonDto = { name: 'Raichu' };
      const mockPokemon = makePokemon({ id: 1, name: 'Raichu' });
      prisma.pokemon.update.mockResolvedValue(mockPokemon);

      const result = await repository.update(1, updateDto);

      expect(result).toEqual(mockPokemon);
      expect(prisma.pokemon.update).toHaveBeenCalledWith({ 
        where: { id: 1 }, 
        data: updateDto 
      });
    });
  });

  describe('delete', () => {
    it('should delete and return the deleted pokemon', async () => {
      const mockPokemon = makePokemon({ id: 1, name: 'Pikachu' });
      prisma.pokemon.delete.mockResolvedValue(mockPokemon);

      const result = await repository.delete(1);

      expect(result).toEqual(mockPokemon);
      expect(prisma.pokemon.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('findPaginated', () => {
    it('should return paginated pokemon results', async () => {
      const mockPokemons = [
        makePokemon({ id: 1, name: 'Pikachu' }),
        makePokemon({ id: 2, name: 'Bulbasaur' }),
      ];
      prisma.pokemon.findMany.mockResolvedValue(mockPokemons);
      prisma.pokemon.count.mockResolvedValue(20);

      const result = await repository.findPaginated(1, 10);

      expect(result.data).toEqual(mockPokemons);
      expect(result.total).toBe(20);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(2);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPreviousPage).toBe(false);
      expect(prisma.pokemon.findMany).toHaveBeenCalledWith({ skip: 0, take: 10 });
      expect(prisma.pokemon.count).toHaveBeenCalled();
    });
  });

  describe('findByMoveIdPaginated', () => {
    it('should return paginated pokemon results filtered by move id', async () => {
      const mockPokemons = [makePokemon({ id: 1, name: 'Pikachu' })];
      prisma.pokemon.findMany.mockResolvedValue(mockPokemons);
      prisma.pokemon.count.mockResolvedValue(1);

      const result = await repository.findByMoveIdPaginated(1, 1, 10);

      expect(result.data).toEqual(mockPokemons);
      expect(result.total).toBe(1);
      expect(prisma.pokemon.findMany).toHaveBeenCalledWith({
        where: { moves: { some: { id: 1 } } },
        skip: 0,
        take: 10,
      });
      expect(prisma.pokemon.count).toHaveBeenCalledWith({
        where: { moves: { some: { id: 1 } } },
      });
    });
  });

  describe('findByAbilityIdPaginated', () => {
    it('should return paginated pokemon results filtered by ability id', async () => {
      const mockPokemons = [makePokemon({ id: 1, name: 'Pikachu', abilityId: 1 })];
      prisma.pokemon.findMany.mockResolvedValue(mockPokemons);
      prisma.pokemon.count.mockResolvedValue(1);

      const result = await repository.findByAbilityIdPaginated(1, 1, 10);

      expect(result.data).toEqual(mockPokemons);
      expect(result.total).toBe(1);
      expect(prisma.pokemon.findMany).toHaveBeenCalledWith({
        where: { abilityId: 1 },
        skip: 0,
        take: 10,
      });
      expect(prisma.pokemon.count).toHaveBeenCalledWith({
        where: { abilityId: 1 },
      });
    });
  });

  describe('findByTypePaginated', () => {
    it('should return paginated pokemon results filtered by type', async () => {
      const mockPokemons = [makePokemon({ id: 1, name: 'Pikachu', type1: Type.ELECTRIC })];
      prisma.pokemon.findMany.mockResolvedValue(mockPokemons);
      prisma.pokemon.count.mockResolvedValue(1);

      const result = await repository.findByTypePaginated(Type.ELECTRIC, 1, 10);

      expect(result.data).toEqual(mockPokemons);
      expect(result.total).toBe(1);
      expect(prisma.pokemon.findMany).toHaveBeenCalledWith({
        where: { OR: [{ type1: Type.ELECTRIC }, { type2: Type.ELECTRIC }] },
        skip: 0,
        take: 10,
      });
      expect(prisma.pokemon.count).toHaveBeenCalledWith({
        where: { OR: [{ type1: Type.ELECTRIC }, { type2: Type.ELECTRIC }] },
      });
    });
  });
});
