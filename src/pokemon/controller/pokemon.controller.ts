import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreatePokemonDto, PokemonDto, UpdatePokemonDto } from '../dto/pokemon.dto';
import { PokemonService } from '../service/pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) { }


  @Get()
  @ApiOperation({ summary: 'Get all pokemons' })
  @ApiResponse({
    status: 200,
    description: 'Return all pokemons',
    type: [PokemonDto],
  })
  async getPokemon(): Promise<PokemonDto[]> {
    return await this.pokemonService.getAllPokemons();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a pokemon by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return a pokemon',
    type: [PokemonDto],
  })
  async getPokemonById(@Param('id', ParseIntPipe) id: number): Promise<PokemonDto> {
    return await this.pokemonService.getPokemonById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new pokemon' })
  @ApiResponse({
    status: 201,
    description: 'create pokemon',
    type: [PokemonDto],
  })
  async createPokemon(@Body() createPokemonDto: CreatePokemonDto): Promise<PokemonDto> {
    return await this.pokemonService.createPokemon(createPokemonDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a pokemon by ID' })
  @ApiResponse({
    status: 200,
    description: 'Update pokemon',
    type: [PokemonDto],
  })
  async updatePokemon(@Param('id', ParseIntPipe) id: number, @Body() updatePokemonDto: UpdatePokemonDto): Promise<PokemonDto> {
    return await this.pokemonService.updatePokemon(id, updatePokemonDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiNoContentResponse({ description: 'Pokemon deleted successfully' })
  @HttpCode(204)
  async deletePokemon(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.pokemonService.deletePokemon(id);
  }
  @Get('move/:id')
  @ApiOperation({ summary: 'Get all Pokémon with given move' })
  @ApiResponse({
    status: 200,
    description: 'Return all Pokémon with the given move',
    type: [PokemonDto],
  })
  async getPokemonByMove(@Param('id') moveId: number,): Promise<PokemonDto[]> {
    return this.pokemonService.getAllByMoveId(moveId);
  }
  @Get('ability/:id')
  @ApiOperation({ summary: 'Get all Pokémon with given ability' })
  @ApiResponse({
    status: 200,
    description: 'Return all Pokémon with the given ability',
    type: [PokemonDto],
  })
  async getPokemonByAbility(@Param('id') abilityId: number,): Promise<PokemonDto[]> {
    return this.pokemonService.getAllByAbilityId(abilityId);
  }
}