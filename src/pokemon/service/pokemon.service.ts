import { Injectable } from "@nestjs/common";
import { CreatePokemonDto, PokemonDto, UpdatePokemonDto } from "../dto/pokemon.dto";
import { PokemonRepository } from "../repository/pokemon.repository";


@Injectable()
export class PokemonService {
    constructor(private readonly pokemonRepository: PokemonRepository) {}

    async getAllPokemons(): Promise<PokemonDto[]> {
        return await this.pokemonRepository.find();
    }

    async getPokemonById(id: number): Promise<PokemonDto> {
        const pokemon = await this.pokemonRepository.findOne(id);
        if(!pokemon){
            throw new Error('Pokemon not found');
        }
        return pokemon;
    }

    async createPokemon(createPokemonDto: CreatePokemonDto): Promise<PokemonDto> {
        const pokemon = await this.pokemonRepository.findOneByName(createPokemonDto.name);
        if(pokemon){
            throw new Error('Pokemon alredy exists');
        }

        const newPokemon = this.pokemonRepository.create(createPokemonDto);
        return newPokemon;
    }

    async updatePokemon(id: number, updatePokemonDto: UpdatePokemonDto): Promise<PokemonDto> {
        const pokemon = await this.pokemonRepository.findOne(id);
        if(!pokemon){
            throw new Error('Pokemon not found');
        }
        return await this.pokemonRepository.update(id, updatePokemonDto);
    }

    async deletePokemon(id: number): Promise<void> {
        const pokemon = await this.pokemonRepository.findOne(id);
        if(!pokemon){
            throw new Error('Pokemon not found');
        }
        await this.pokemonRepository.delete(id);
    }
}