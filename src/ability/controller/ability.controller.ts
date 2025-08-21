import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AbilityDto, CreateAbilityDto, UpdateAbilityDto } from '../dto/ability.dto';
import { AbilityService } from '../service/ability.service';

@Controller('ability')
export class AbilityController {
    constructor(private readonly abilityService: AbilityService) { }


    @Get()
    @ApiOperation({ summary: 'Get all abilities' })
    @ApiResponse({
        status: 200,
        description: 'Return all abilities',
        type: [AbilityDto],
    })
    async getAbilities(): Promise<AbilityDto[]> {
        return await this.abilityService.getAllAbilities();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get ability by ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({
        status: 200,
        description: 'Return ability by ID',
        type: AbilityDto,
    })
    async getAbility(@Param('id', ParseIntPipe) id: number): Promise<AbilityDto> {
        return await this.abilityService.getAbilityById(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new ability' })
    @ApiResponse({
        status: 201,
        description: 'Return the created ability',
        type: AbilityDto,
    })
    async createAbility(@Body() createAbilityDto: CreateAbilityDto): Promise<AbilityDto> {
        return await this.abilityService.createAbility(createAbilityDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an ability by ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({
        status: 200,
        description: 'Return the updated ability',
        type: AbilityDto,
    })
    async updateAbility(@Param('id', ParseIntPipe) id: number, @Body() updateAbilityDto: UpdateAbilityDto): Promise<AbilityDto> {
        return await this.abilityService.updateAbility(id, updateAbilityDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an ability by ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({
        status: 204,
        description: 'Ability deleted successfully',
    })
    async deleteAbility(@Param('id', ParseIntPipe) id: number): Promise<AbilityDto> {
        return await this.abilityService.deleteAbility(id);
    }
}