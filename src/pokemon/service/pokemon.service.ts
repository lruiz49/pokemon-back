import { Injectable } from "@nestjs/common";
import { CreatePokemonDto, PokemonDto, UpdatePokemonDto } from "../dto/pokemon.dto";
import { PokemonRepository } from "../repository/pokemon.repository";
import { Type } from "@prisma/client";


@Injectable()
export class PokemonService {
    constructor(private readonly pokemonRepository: PokemonRepository) { }

    async getAllPokemons(): Promise<PokemonDto[]> {
        return this.pokemonRepository.find();
    }

    async getPokemonById(id: number): Promise<PokemonDto> {
        return this.pokemonRepository.findOne(id);
    }

    async createPokemon(createPokemonDto: CreatePokemonDto): Promise<PokemonDto> {
        return this.pokemonRepository.create(createPokemonDto);
    }

    async updatePokemon(id: number, updatePokemonDto: UpdatePokemonDto): Promise<PokemonDto> {
        return this.pokemonRepository.update(id, updatePokemonDto);
    }

    async deletePokemon(id: number): Promise<PokemonDto> {
        return this.pokemonRepository.delete(id);
    }

    async getAllByMove(moveId: number): Promise<PokemonDto[]> {
        return this.pokemonRepository.findByMoveId(moveId);
    }

    async getAllByAbility(abilityId: number): Promise<PokemonDto[]> {
        return this.pokemonRepository.findByAbilityId(abilityId);
    }

    async getAllByType(type: Type): Promise<PokemonDto[]> {
        return this.pokemonRepository.findByType(type);
    }
}