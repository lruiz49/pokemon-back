import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CreatePokemonDto,
  PokemonDto,
  UpdatePokemonDto,
  PaginationQueryDto,
  PaginatedResponseDto,
} from '../dto/pokemon.dto';
import { PokemonService } from '../service/pokemon.service';
import { Type } from '@prisma/client';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  @ApiOperation({ summary: 'Get all pokemons with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Return paginated pokemons',
    type: PaginatedResponseDto,
  })
  async getPokemon(
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<PokemonDto>> {
    return await this.pokemonService.getAllPokemonsPaginated(
      pagination.page,
      pagination.limit,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a pokemon by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return a pokemon',
    type: [PokemonDto],
  })
  async getPokemonById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PokemonDto> {
    return await this.pokemonService.getPokemonById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new pokemon' })
  @ApiResponse({
    status: 201,
    description: 'create pokemon',
    type: [PokemonDto],
  })
  async createPokemon(
    @Body() createPokemonDto: CreatePokemonDto,
  ): Promise<PokemonDto> {
    return await this.pokemonService.createPokemon(createPokemonDto);
  }

  @Patch(':id')
  @ApiParam({ name: 'pokemonId', type: Number })
  @ApiOperation({ summary: 'Update a pokemon by ID' })
  @ApiResponse({
    status: 200,
    description: 'Update pokemon',
    type: [PokemonDto],
  })
  async updatePokemon(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePokemonDto: UpdatePokemonDto,
  ): Promise<PokemonDto> {
    return await this.pokemonService.updatePokemon(id, updatePokemonDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'pokemonId', type: Number })
  @ApiNoContentResponse({
    description: 'Pokemon deleted successfully',
    type: [PokemonDto],
  })
  @HttpCode(204)
  async deletePokemon(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PokemonDto> {
    return await this.pokemonService.deletePokemon(id);
  }

  @Get('move/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiOperation({ summary: 'Get all Pokémon with given move' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated Pokémon with the given move',
    type: PaginatedResponseDto,
  })
  async getPokemonByMove(
    @Param('id', ParseIntPipe) moveId: number,
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<PokemonDto>> {
    return this.pokemonService.getAllByMovePaginated(
      moveId,
      pagination.page,
      pagination.limit,
    );
  }
  @Get('ability/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiOperation({ summary: 'Get all Pokémon with given ability' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated Pokémon with the given ability',
    type: PaginatedResponseDto,
  })
  async getPokemonByAbility(
    @Param('id', ParseIntPipe) abilityId: number,
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<PokemonDto>> {
    return this.pokemonService.getAllByAbilityPaginated(
      abilityId,
      pagination.page,
      pagination.limit,
    );
  }

  @Get('type/:type')
  @ApiParam({ name: 'type', type: String })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiOperation({ summary: 'Get all Pokémon with given type' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated Pokémon with the given type',
    type: PaginatedResponseDto,
  })
  async getPokemonByType(
    @Param('type') type: Type,
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<PokemonDto>> {
    return this.pokemonService.getAllByTypePaginated(
      type,
      pagination.page,
      pagination.limit,
    );
  }
}
