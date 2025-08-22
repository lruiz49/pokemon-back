import {
  ValidationPipe,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import {
  CreatePokemonDto,
  UpdatePokemonDto,
  PokemonDto,
} from '../../../src/pokemon/dto/pokemon.dto';
import { Type as PokeType } from '@prisma/client';

function makePipe() {
  return new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: { enableImplicitConversion: true },
    validationError: { target: false, value: false },
  });
}

function meta<T>(metatype: new () => T): ArgumentMetadata {
  return { type: 'body', metatype, data: '' };
}

describe('DTO validation with ValidationPipe', () => {
  const pipe = makePipe();

  it('(CreatePokemonDto) accepts a valid body and coerces numbers', async () => {
    const body = {
      name: 'Pikachu',
      description: 'Electric mouse',
      type1: PokeType.ELECTRIC,
      height: '40',
      weight: '6.9',
      imageUrl: 'http://ex.com/pika.png',
      abilityId: '3',
      moveIds: ['1', 2],
    };

    const result = (await pipe.transform(
      body,
      meta(CreatePokemonDto),
    )) as CreatePokemonDto;
    expect(result.height).toBe(40);
    expect(result.weight).toBe(6.9);
    expect(result.moveIds).toEqual([1, 2]);
  });

  it('(CreatePokemonDto) rejects unknown fields (forbidNonWhitelisted)', async () => {
    const body: any = {
      name: 'Bulbasaur',
      type1: PokeType.GRASS,
      height: 70,
      weight: 6.9,
      imageUrl: 'http://ex.com/bulba.png',
      sneaky: 'nope',
    };
    await expect(
      pipe.transform(body, meta(CreatePokemonDto)),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('(CreatePokemonDto) rejects invalid weight (not a number)', async () => {
    const body: any = {
      name: 'Squirtle',
      type1: PokeType.WATER,
      height: 50,
      weight: 'oops',
      imageUrl: 'http://ex.com/squirtle.png',
    };
    await expect(
      pipe.transform(body, meta(CreatePokemonDto)),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('(CreatePokemonDto) rejects invalid enum', async () => {
    const body: any = {
      name: 'Charmander',
      type1: 'FIREY',
      height: 60,
      weight: 8,
      imageUrl: 'http://ex.com/char.png',
    };
    await expect(
      pipe.transform(body, meta(CreatePokemonDto)),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('(CreatePokemonDto) rejects too many moveIds and duplicates', async () => {
    const body: any = {
      name: 'Mew',
      type1: PokeType.PSYCHIC,
      height: 40,
      weight: 4,
      imageUrl: 'http://ex.com/mew.png',
      moveIds: [1, 2, 2, 3, 4, 5],
    };
    await expect(
      pipe.transform(body, meta(CreatePokemonDto)),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('(UpdatePokemonDto) allows partials (no required fields)', async () => {
    const body = { weight: '12.34' };
    const result = (await pipe.transform(
      body,
      meta(UpdatePokemonDto),
    )) as UpdatePokemonDto;
    expect(result.weight).toBe(12.34);
  });

  it('(PokemonDto) validates dates and transforms to Date', async () => {
    const body = {
      name: 'Eevee',
      type1: PokeType.NORMAL,
      height: 30,
      weight: 6.5,
      imageUrl: 'http://ex.com/eevee.png',
      id: 123,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-02-01T00:00:00.000Z',
    };
    const result = (await pipe.transform(body, meta(PokemonDto))) as PokemonDto;
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
  });
  it('(PokemonDto) rejects missing required fields', async () => {
    const body = {
      type1: PokeType.NORMAL,
      height: 30,
      weight: 6.5,
      imageUrl: 'http://ex.com/eevee.png',
      id: 123,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-02-01T00:00:00.000Z',
    };
    await expect(pipe.transform(body, meta(PokemonDto))).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
