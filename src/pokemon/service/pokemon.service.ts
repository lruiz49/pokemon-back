import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
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
            throw new NotFoundException('Pokemon not found');
        }
        return pokemon;
    }

    async createPokemon(createPokemonDto: CreatePokemonDto): Promise<PokemonDto> {
        const pokemon = await this.pokemonRepository.create(createPokemonDto);
        if(!pokemon){
            throw new ConflictException('Pokemon already exists');
        }
        return pokemon;
    }

    async updatePokemon(id: number, updatePokemonDto: UpdatePokemonDto): Promise<PokemonDto> {
        const pokemon = await this.pokemonRepository.findOne(id);
        if(!pokemon){
            throw new NotFoundException('Pokemon not found');
        }
        return await this.pokemonRepository.update(id, updatePokemonDto);
    }

    async deletePokemon(id: number): Promise<void> {
        const pokemon = await this.pokemonRepository.findOne(id);
        if(!pokemon){
            throw new NotFoundException('Pokemon not found');
        }
        await this.pokemonRepository.delete(id);
    }
}