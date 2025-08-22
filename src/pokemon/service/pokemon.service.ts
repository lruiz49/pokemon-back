import { Injectable } from '@nestjs/common';
import {
  CreatePokemonDto,
  PokemonDto,
  UpdatePokemonDto,
  PaginatedResponseDto,
} from '../dto/pokemon.dto';
import { PokemonRepository } from '../repository/pokemon.repository';
import { Type } from '@prisma/client';

@Injectable()
export class PokemonService {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async getAllPokemonsPaginated(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponseDto<PokemonDto>> {
    return this.pokemonRepository.findPaginated(page, limit);
  }

  async getPokemonById(id: number): Promise<PokemonDto> {
    return this.pokemonRepository.findOne(id);
  }

  async createPokemon(createPokemonDto: CreatePokemonDto): Promise<PokemonDto> {
    return this.pokemonRepository.create(createPokemonDto);
  }

  async updatePokemon(
    id: number,
    updatePokemonDto: UpdatePokemonDto,
  ): Promise<PokemonDto> {
    return this.pokemonRepository.update(id, updatePokemonDto);
  }

  async deletePokemon(id: number): Promise<PokemonDto> {
    return this.pokemonRepository.delete(id);
  }

  async getAllByMovePaginated(
    moveId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponseDto<PokemonDto>> {
    return this.pokemonRepository.findByMoveIdPaginated(moveId, page, limit);
  }

  async getAllByAbilityPaginated(
    abilityId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponseDto<PokemonDto>> {
    return this.pokemonRepository.findByAbilityIdPaginated(
      abilityId,
      page,
      limit,
    );
  }

  async getAllByTypePaginated(
    type: Type,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponseDto<PokemonDto>> {
    return this.pokemonRepository.findByTypePaginated(type, page, limit);
  }
}
