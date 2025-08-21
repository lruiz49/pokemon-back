import { Test } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';
import { PokemonRepository } from '../repository/pokemon.repository';
import { Type } from '@prisma/client';
import { UpdatePokemonDto } from '../dto/pokemon.dto';

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

function setup() {
    const repoMock = {
        find: jest.fn(),
        findOne: jest.fn(),
        findOneByName: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    return Test.createTestingModule({
        providers: [
            PokemonService,
            { provide: PokemonRepository, useValue: repoMock },
        ],
    }).compile().then(m => ({
        service: m.get(PokemonService),
        repo: m.get(PokemonRepository) as jest.Mocked<PokemonRepository>,
    }));
}

describe('getAllPokemon', () => {

    let service: PokemonService,
        repo: jest.Mocked<PokemonRepository>;

    beforeEach(async () => {
        ({ service, repo } = await setup());
    });
    afterEach(() => jest.clearAllMocks());
    it('(getAll)should return all pokemons', async () => {

        repo.find.mockResolvedValue([makePokemon({ name: 'Pikachu' })]);

        const result = await service.getAllPokemons();

        expect(result[0].name).toBe('Pikachu');
        expect(repo.find).toHaveBeenCalled();
    });
    it('(getAll)should return a pokemon by id', async () => {

        repo.findOne.mockResolvedValue(makePokemon({ id: 42, name: 'Bulbasaur' }));

        const result = await service.getPokemonById(42);

        expect(result.id).toBe(42);
        expect(result.name).toBe('Bulbasaur');
        expect(repo.findOne).toHaveBeenCalledWith(42);
    });
});

describe('getPokemonByIdService', () => {
    let service: PokemonService,
        repo: jest.Mocked<PokemonRepository>;

    beforeEach(async () => {
        ({ service, repo } = await setup());
    });
    afterEach(() => jest.clearAllMocks());
    it('(getPokemonByID) should return pokemon with same id', async () => {
        repo.findOne.mockResolvedValue(makePokemon({ id: 10, name: "Pikachu" }))

        const result = await service.getPokemonById(10);

        expect(result.id).toBe(10);
        expect(result.name).toBe('Pikachu')
        expect(repo.findOne).toHaveBeenCalledWith(10);
    });
    it('(getPokemonById)should throw error if pokemon not found', async () => {

        repo.findOne.mockResolvedValue(null);

        await expect(service.getPokemonById(99))
            .rejects
            .toThrow('Pokemon not found');

    });
});

describe('createPokemonService', () => {
    let service: PokemonService,
        repo: jest.Mocked<PokemonRepository>;

    beforeEach(async () => {
        ({ service, repo } = await setup());
    });
    afterEach(() => jest.clearAllMocks());
    it('(create)should create and return new pokemon', async () => {

        
        repo.create.mockResolvedValue(makePokemon({ name: "Bulbasaur", id: 10 }));

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
    it('(create)should throw error if pokemon to create already exists', async () => {

        repo.findOneByName.mockResolvedValue(makePokemon({ name: "Bulbasaur" }));

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

        await expect(service.createPokemon(dto))
            .rejects
            .toThrow('Pokemon already exists');
    });
});

describe('UpdatePokemonService', () => {
    let service: PokemonService,
        repo: jest.Mocked<PokemonRepository>;

    beforeEach(async () => {
        ({ service, repo } = await setup());
    });
    afterEach(() => jest.clearAllMocks());
    it('(update)should update pokemon and return new one ', async () => {

        const existing = makePokemon({ id: 10, name: "Pikachu" });
        const updated = makePokemon({ id: 10, name: "Raichu" })

        const updateDto: Partial<UpdatePokemonDto> = { name: 'Raichu' };

        repo.findOne.mockResolvedValue(existing);
        repo.update.mockResolvedValue(updated);

        const result = await service.updatePokemon(10, updateDto);

        expect(result.name).toBe('Raichu');
        expect(repo.findOne).toHaveBeenCalledWith(10);
        expect(repo.update).toHaveBeenCalledWith(10, { name: 'Raichu' });
    });
    it('(update)should throw error if pokemon not found', async () => {

        repo.findOne.mockResolvedValue(null);

        const updateDto: Partial<UpdatePokemonDto> = { name: 'Juan' };

        await expect(service.updatePokemon(10, updateDto))
            .rejects
            .toThrow('Pokemon not found');
    });
});

describe('DeletePokemonService', () => {
    let service: PokemonService,
        repo: jest.Mocked<PokemonRepository>;

    beforeEach(async () => {
        ({ service, repo } = await setup());
    });
    afterEach(() => jest.clearAllMocks());
    it('(delete)should delete a pokemon when it exists', async () => {

        repo.findOne.mockResolvedValue(makePokemon({ id: 7, name: 'Squirtle' }));
        repo.delete.mockResolvedValue(undefined);

        await service.deletePokemon(7);

        expect(repo.findOne).toHaveBeenCalledWith(7);
        expect(repo.delete).toHaveBeenCalledWith(7);
    });
    it('(delete)should throw error if pokemon not found', async () => {
        repo.findOne.mockResolvedValue(null);

        await expect(service.deletePokemon(10))
            .rejects
            .toThrow('Pokemon not found');
    });
});
