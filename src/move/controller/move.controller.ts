import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ApiNoContentResponse, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { CreateMoveDto, MoveDto, UpdateMoveDto } from "../dto/move.dto";
import { MoveService } from "../service/move.service";
import { PokemonDto } from "src/pokemon/dto/pokemon.dto";

@Controller("move")
export class MoveController {

    constructor(private readonly moveService: MoveService) { }

    @Get()
    @ApiOperation({ summary: "Get all Moves" })
    @ApiResponse({
        status: 200,
        description: 'Return all pokemons',
        type: [MoveDto],
    })
    async getMoves(): Promise<MoveDto[]> {
        return await this.moveService.getAllMoves();
    }

    @Post()
    @ApiOperation({ summary: 'Create a new move' })
    @ApiResponse({
        status: 201,
        description: 'create move',
        type: [MoveDto],
    })
    async createMove(@Body() createMoveDto: CreateMoveDto): Promise<MoveDto> {
        return await this.moveService.createMove(createMoveDto);
    }

    @Patch(':id')
    @ApiParam({ name: 'moveId', type: Number })
    @ApiOperation({ summary: 'Update a move by ID' })
    @ApiResponse({
        status: 200,
        description: 'Update move',
        type: [MoveDto],
    })
    async updateMove(@Param('id', ParseIntPipe) id: number, @Body() updateMoveDto: UpdateMoveDto): Promise<MoveDto> {
        return await this.moveService.updateMove(id, updateMoveDto);
    }

    @Delete(':id')
      @ApiParam({ name: 'moveId', type: Number })
      @ApiNoContentResponse({ description: 'Move deleted successfully' })
      @HttpCode(204)
      async deleteMove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.moveService.deleteMove(id);
      }

}
