import {
  INestApplication,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { PokemonController } from 'src/pokemon/controller/pokemon.controller';
import { PokemonService } from 'src/pokemon/service/pokemon.service';
import { PrismaClientExceptionFilter } from 'src/common/filters/prisma-client-exception.filter';
import { Prisma, Type } from '@prisma/client';

function prismaErr(code: 'P2002' | 'P2003', meta?: Record<string, any>) {
  const e = new Prisma.PrismaClientKnownRequestError('prisma error', {
    code,
    clientVersion: 'test',
  } as any);
  (e as any).code = code;
  (e as any).meta = meta;
  return e;
}

describe('Pokemon e2e global and validations', () => {
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
    app.useGlobalFilters(new PrismaClientExceptionFilter());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /pokemon/abc -> 400 ', async () => {
    await request(app.getHttpServer()).get('/pokemon/abc').expect(400);
  });

  it('POST /pokemon invalid body -> 400 ', async () => {
    await request(app.getHttpServer())
      .post('/pokemon')
      .send({ name: 'Squirtle', weight: 'oops', type1: 'WATER' })
      .expect(400);
  });

  it('POST /pokemon duplicate name -> 409 (Prisma P2002)', async () => {
    serviceMock.createPokemon.mockRejectedValueOnce(
      prismaErr('P2002', { target: ['name'] }),
    );

    await request(app.getHttpServer())
      .post('/pokemon')
      .send({
        name: 'Pikachu',
        type1: Type.ELECTRIC,
        height: 40,
        weight: 6,
        imageUrl: 'http://ex.com/pika.png',
      })
      .expect(409)
      .expect(({ body }) => {
        expect(body.statusCode).toBe(409);
      });
  });

  it('POST /pokemon invalid abilityId -> 400 (Prisma P2003)', async () => {
    serviceMock.createPokemon.mockRejectedValueOnce(
      prismaErr('P2003', { field_name: 'abilityId' }),
    );

    await request(app.getHttpServer())
      .post('/pokemon')
      .send({
        name: 'Bulbasaur',
        type1: Type.GRASS,
        height: 70,
        weight: 6.9,
        imageUrl: 'http://ex.com/bulba.png',
        abilityId: 9999,
      })
      .expect(400);
  });

  it('GET /pokemon/:id not found -> 404 (service throws NotFoundException)', async () => {
    serviceMock.getPokemonById.mockRejectedValueOnce(
      new NotFoundException('Pokemon not found'),
    );

    await request(app.getHttpServer()).get('/pokemon/999').expect(404);
  });
});
