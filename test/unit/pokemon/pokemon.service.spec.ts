import { Test } from '@nestjs/testing';
import { PokemonService } from '../../../src/pokemon/service/pokemon.service';
import { PokemonRepository } from '../../../src/pokemon/repository/pokemon.repository';
import { Type } from '@prisma/client';
import { UpdatePokemonDto, PaginatedResponseDto } from '../../../src/pokemon/dto/pokemon.dto';

function makePaginatedResponse<T>(data: T[], page: number = 1, limit: number = 10): PaginatedResponseDto<T> {
  const total = data.length;
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

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
    moves: [],
    ability: null,
    ...overrides,
  };
}

function setup() {
  const repoMock = {
    findPaginated: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByMoveIdPaginated: jest.fn(),
    findByAbilityIdPaginated: jest.fn(),
    findByTypePaginated: jest.fn(),
  };

  return Test.createTestingModule({
    providers: [
      PokemonService,
      { provide: PokemonRepository, useValue: repoMock },
    ],
  })
    .compile()
    .then((m) => ({
      service: m.get(PokemonService),
      repo: m.get(PokemonRepository),
    }));
}

describe('getAllPokemonsPaginated', () => {
  let service: PokemonService, repo: any;

  beforeEach(async () => {
    ({ service, repo } = await setup());
  });
  afterEach(() => jest.clearAllMocks());
  it('(getAllPaginated) should return paginated pokemons', async () => {
    const mockPokemon = makePokemon({ name: 'Pikachu' });
    const paginatedResponse = makePaginatedResponse([mockPokemon]);
    
    repo.findPaginated.mockResolvedValue(paginatedResponse);

    const result = await service.getAllPokemonsPaginated(1, 10);

    expect(result.data[0].name).toBe('Pikachu');
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(repo.findPaginated).toHaveBeenCalledWith(1, 10);
  });

  it('(getById) should return a pokemon by id', async () => {
    repo.findOne.mockResolvedValue(makePokemon({ id: 42, name: 'Bulbasaur' }));

    const result = await service.getPokemonById(42);

    expect(result.id).toBe(42);
    expect(result.name).toBe('Bulbasaur');
    expect(repo.findOne).toHaveBeenCalledWith(42);
  });
});
describe('getPokemonByIdService', () => {
  let service: PokemonService, repo: any;

  beforeEach(async () => {
    ({ service, repo } = await setup());
  });
  afterEach(() => jest.clearAllMocks());
  it('(getPokemonByID) should return pokemon with same id', async () => {
    repo.findOne.mockResolvedValue(makePokemon({ id: 10, name: 'Pikachu' }));

    const result = await service.getPokemonById(10);

    expect(result.id).toBe(10);
    expect(result.name).toBe('Pikachu');
    expect(repo.findOne).toHaveBeenCalledWith(10);
  });
});

describe('createPokemonService', () => {
  let service: PokemonService, repo: any;

  beforeEach(async () => {
    ({ service, repo } = await setup());
  });
  afterEach(() => jest.clearAllMocks());
  it('(create)should create and return new pokemon', async () => {
    repo.create.mockResolvedValue(makePokemon({ name: 'Bulbasaur', id: 10 }));

    const dto = {
      name: 'Bulbasaur',
      description: 'Seed',
      type1: Type.GRASS,
      height: 70,
      weight: 6.9,
      imageUrl: 'http://ex.com/bulba.png',
      abilityId: null,
      moveIds: [1, 2],
    };

    const result = await service.createPokemon(dto);

    expect(result.id).toBe(10);
    expect(result.name).toBe('Bulbasaur');
  });
});

describe('UpdatePokemonService', () => {
  let service: PokemonService, repo: any;

  beforeEach(async () => {
    ({ service, repo } = await setup());
  });
  afterEach(() => jest.clearAllMocks());
  it('(update)should update pokemon and return new one ', async () => {
    const updated = makePokemon({ id: 10, name: 'Raichu' });

    const updateDto: Partial<UpdatePokemonDto> = { name: 'Raichu' };

    repo.update.mockResolvedValue(updated);

    const result = await service.updatePokemon(10, updateDto);

    expect(result.name).toBe('Raichu');
    expect(repo.update).toHaveBeenCalledWith(10, { name: 'Raichu' });
  });
});

describe('DeletePokemonService', () => {
  let service: PokemonService, repo: any;

  beforeEach(async () => {
    ({ service, repo } = await setup());
  });
  afterEach(() => jest.clearAllMocks());
  it('(delete)should delete a pokemon when it exists', async () => {
    repo.delete.mockResolvedValue(makePokemon({ id: 7, name: 'Squirtle' }));

    const result = await service.deletePokemon(7);

    expect(result.name).toBe('Squirtle');
    expect(result.id).toBe(7);
    expect(repo.delete).toHaveBeenCalledWith(7);
  });
});
