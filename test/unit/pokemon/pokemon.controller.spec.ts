// test/unit/pokemon/pokemon.controller.spec.ts
import { Test } from '@nestjs/testing';
import { PokemonController } from '../../../src/pokemon/controller/pokemon.controller';
import { PokemonService } from '../../../src/pokemon/service/pokemon.service';
import { Type } from '@prisma/client';
import { UpdatePokemonDto, PaginatedResponseDto, PokemonDto } from '../../../src/pokemon/dto/pokemon.dto';

type ServiceMock = jest.Mocked<PokemonService>;

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
    ...overrides,
  };
}

async function setup() {
  const service: ServiceMock = {
    getAllPokemonsPaginated: jest.fn(),
    getPokemonById: jest.fn(),
    createPokemon: jest.fn(),
    updatePokemon: jest.fn(),
    deletePokemon: jest.fn(),
    getAllByMovePaginated: jest.fn(),
    getAllByAbilityPaginated: jest.fn(),
    getAllByTypePaginated: jest.fn(),
  } as unknown as ServiceMock;

  const moduleRef = await Test.createTestingModule({
    controllers: [PokemonController],
    providers: [{ provide: PokemonService, useValue: service }],
  }).compile();

  return {
    controller: moduleRef.get(PokemonController),
    service: moduleRef.get(PokemonService),
  };
}

afterEach(() => jest.clearAllMocks());

describe('PokemonController', () => {
  let controller: PokemonController;
  let service: ServiceMock;

  beforeEach(async () => {
    const setup_result = await setup();
    controller = setup_result.controller;
    service = setup_result.service as ServiceMock;
  });

  it('GET /pokemon -> returns paginated list', async () => {
    const mockPokemon = makePokemon({ name: 'Pikachu' });
    const paginatedResponse = makePaginatedResponse([mockPokemon]);
    
    service.getAllPokemonsPaginated.mockResolvedValue(paginatedResponse);

    const res = await controller.getPokemon({ page: 1, limit: 10 });

    expect(res.data[0].name).toBe('Pikachu');
    expect(res.total).toBe(1);
    expect(res.page).toBe(1);
    expect(service.getAllPokemonsPaginated).toHaveBeenCalledWith(1, 10);
  });

  it('GET /pokemon/:id -> returns item', async () => {
    service.getPokemonById.mockResolvedValue(
      makePokemon({ id: 42, name: 'Bulbasaur' }),
    );

    const res = await controller.getPokemonById(42);

    expect(res.id).toBe(42);
    expect(service.getPokemonById).toHaveBeenCalledWith(42);
  });
  it('GET /pokemon/:id -> throws NotFoundException when service says not found', async () => {
    service.getPokemonById.mockRejectedValue(new Error('Pokemon not found'));

    await expect(controller.getPokemonById(999)).rejects.toThrow(
      'Pokemon not found',
    );
  });

  it('POST /pokemon -> creates', async () => {
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
    service.createPokemon.mockResolvedValue(
      makePokemon({ id: 10, name: 'Bulbasaur' }),
    );

    const res = await controller.createPokemon(dto);

    expect(res.id).toBe(10);
    expect(service.createPokemon).toHaveBeenCalledWith(dto);
  });
  it('GET /pokemon/create -> throws DuplicatePokemonException', async () => {
    service.createPokemon.mockRejectedValue(
      new Error('Pokemon already exists'),
    );

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

    await expect(controller.createPokemon(dto)).rejects.toThrow(
      'Pokemon already exists',
    );
  });

  it('PATCH /pokemon/:id -> updates', async () => {
    service.updatePokemon.mockResolvedValue(
      makePokemon({ id: 1, name: 'Raichu' }),
    );

    const updateDto: Partial<UpdatePokemonDto> = { name: 'Raichu' };
    const res = await controller.updatePokemon(1, updateDto);

    expect(res.name).toBe('Raichu');
    expect(service.updatePokemon).toHaveBeenCalledWith(1, updateDto);
  });
  it('PATCH /pokemon/:id -> throws NotFoundException when pokemon not found', async () => {
    service.updatePokemon.mockRejectedValue(new Error('Pokemon not found'));
    const updateDto: Partial<UpdatePokemonDto> = { name: 'Raichu' };

    await expect(controller.updatePokemon(999, updateDto)).rejects.toThrow(
      'Pokemon not found',
    );
  });

  it('DELETE /pokemon/:id -> deletes', async () => {
    service.deletePokemon.mockResolvedValue(makePokemon({ id: 7 }));

    await controller.deletePokemon(7);

    expect(service.deletePokemon).toHaveBeenCalledWith(7);
  });
  it('DELETE /pokemon/:id -> throws NotFoundException when pokemon not found', async () => {
    service.deletePokemon.mockRejectedValue(new Error('Pokemon not found'));

    await expect(controller.deletePokemon(999)).rejects.toThrow(
      'Pokemon not found',
    );
  });
});
