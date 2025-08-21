import { Test } from '@nestjs/testing';
import { ConflictException, INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { PokemonController } from 'src/pokemon/controller/pokemon.controller';
import { PokemonService } from 'src/pokemon/service/pokemon.service';
import { Type } from '@prisma/client';


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

describe('PokemonController e2e with mocked service', () => {
    let app: INestApplication;
    const serviceMock: jest.Mocked<PokemonService> = {
        getAllPokemons: jest.fn(),
        getPokemonById: jest.fn(),
        createPokemon: jest.fn(),
        updatePokemon: jest.fn(),
        deletePokemon: jest.fn(),
    } as any;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [PokemonController],
            providers: [{ provide: PokemonService, useValue: serviceMock }],
        }).compile();

        app = moduleRef.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
                whitelist: true,
                forbidNonWhitelisted: true,
            }),
        );
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET /pokemon -> 200 with list', async () => {
        serviceMock.getAllPokemons.mockResolvedValue([
            makePokemon({ name: 'Pikachu' }),
            makePokemon({ name: 'Bulbasaur' }),
        ]);

        await request(app.getHttpServer())
            .get('/pokemon')
            .expect(200)
            .expect(({ body }) => {
                expect(Array.isArray(body)).toBe(true);
                expect(body[0].name).toBe('Pikachu');
            });
    });

    it('GET /pokemon/:id -> 200 with item', async () => {
        serviceMock.getPokemonById.mockResolvedValue(makePokemon({ id: 42, name: 'Bulbasaur' }));

        await request(app.getHttpServer())
            .get('/pokemon/42')
            .expect(200)
            .expect(({ body }) => {
                expect(body.id).toBe(42);
                expect(body.name).toBe('Bulbasaur');
            });
    });

    it('GET /pokemon/:id -> 404 when not found ', async () => {

        serviceMock.getPokemonById.mockRejectedValue(new NotFoundException('Pokemon not found'));

        await request(app.getHttpServer()).get('/pokemon/999');


        await request(app.getHttpServer())
            .get('/pokemon/999')
            .expect(404);

    });

    it('POST /pokemon -> 400 on invalid body ', async () => {
        const invalid = {
            name: 'Squirtle',
            type1: 'WATER',
            height: 50,
            weight: 'oops',
            imageUrl: 'http://ex.com/sq.png',
        };

        await request(app.getHttpServer()).post('/pokemon').send(invalid).expect(400);
    });

    it('POST /pokemon -> 201 on success', async () => {
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
        serviceMock.createPokemon.mockResolvedValue(makePokemon({ id: 10, name: 'Bulbasaur' }));

        await request(app.getHttpServer())
            .post('/pokemon')
            .send(dto)
            .expect(201)
            .expect(({ body }) => {
                expect(body.id).toBe(10);
                expect(body.name).toBe('Bulbasaur');
            });
    });

    it('POST /pokemon -> 409 on pokemon name already in use', async () => {
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
        serviceMock.createPokemon.mockRejectedValue(new ConflictException('Pokemon already exists'));

        await request(app.getHttpServer())
            .post('/pokemon')
            .send(dto)
            .expect(409);
    });

    it('PATCH /pokemon/:id -> 200 on success', async () => {
        serviceMock.updatePokemon.mockResolvedValue(makePokemon({ id: 7, name: 'Raichu' }));

        await request(app.getHttpServer())
            .patch('/pokemon/7')
            .send({ name: 'Raichu' })
            .expect(200)
            .expect(({ body }) => {
                expect(body.id).toBe(7);
                expect(body.name).toBe('Raichu');
            });
    });

    it('PATCH /pokemon/:id -> 404 when not found', async () => {
        serviceMock.updatePokemon.mockRejectedValue(new NotFoundException('Pokemon not found'));

        await request(app.getHttpServer())
            .patch('/pokemon/999')
            .send({ name: 'Missing' })
            .expect(404);
    });

    it('DELETE /pokemon/:id -> 204 on success', async () => {
        serviceMock.deletePokemon.mockResolvedValue(undefined);

        await request(app.getHttpServer()).delete('/pokemon/7').expect(204);
    });
    it('DELETE /pokemon/:id -> 404 when not found', async () => {
        serviceMock.deletePokemon.mockRejectedValue(new NotFoundException('Pokemon not found'));

        await request(app.getHttpServer())
            .delete('/pokemon/999')
            .expect(404);
    });
});

