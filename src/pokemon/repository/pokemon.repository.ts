import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
    CreatePokemonDto,
    PokemonDto,
    UpdatePokemonDto,
    PaginatedResponseDto,
} from '../dto/pokemon.dto';
import { Type } from '@prisma/client';

@Injectable()
export class PokemonRepository {
    constructor(private prisma: PrismaService) { }

    async findOne(id: number): Promise<PokemonDto> {
        return await this.prisma.pokemon.findUniqueOrThrow({
            where: { id },
            include: {
                moves: true,
                ability: true
            }
        });
    }

    async create(data: CreatePokemonDto): Promise<PokemonDto> {
        return await this.prisma.pokemon.create({ data });
    }

    async update(id: number, data: UpdatePokemonDto): Promise<PokemonDto> {
        return await this.prisma.pokemon.update({ where: { id }, data });
    }

    async delete(id: number): Promise<PokemonDto> {
        return await this.prisma.pokemon.delete({ where: { id } });
    }

    async findPaginated(
        page: number,
        limit: number,
    ): Promise<PaginatedResponseDto<PokemonDto>> {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.pokemon.findMany({
                skip,
                take: limit,
            }),
            this.prisma.pokemon.count(),
        ]);

        return this.createPaginatedResponse(data, total, page, limit);
    }

    async findByMoveIdPaginated(
        moveId: number,
        page: number,
        limit: number,
    ): Promise<PaginatedResponseDto<PokemonDto>> {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.pokemon.findMany({
                where: { moves: { some: { id: moveId } } },
                skip,
                take: limit,
            }),
            this.prisma.pokemon.count({
                where: { moves: { some: { id: moveId } } },
            }),
        ]);

        return this.createPaginatedResponse(data, total, page, limit);
    }

    async findByAbilityIdPaginated(
        abilityId: number,
        page: number,
        limit: number,
    ): Promise<PaginatedResponseDto<PokemonDto>> {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.pokemon.findMany({
                where: { abilityId: abilityId },
                skip,
                take: limit,
            }),
            this.prisma.pokemon.count({
                where: { abilityId: abilityId },
            }),
        ]);

        return this.createPaginatedResponse(data, total, page, limit);
    }

    async findByTypePaginated(
        type: Type,
        page: number,
        limit: number,
    ): Promise<PaginatedResponseDto<PokemonDto>> {
        const skip = (page - 1) * limit;
        const where = {
            OR: [{ type1: type }, { type2: type }],
        };

        const [data, total] = await Promise.all([
            this.prisma.pokemon.findMany({
                where,
                skip,
                take: limit,
            }),
            this.prisma.pokemon.count({ where }),
        ]);

        return this.createPaginatedResponse(data, total, page, limit);
    }

    private createPaginatedResponse<T>(
        data: T[],
        total: number,
        page: number,
        limit: number,
    ): PaginatedResponseDto<T> {
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        return {
            data,
            total,
            page,
            limit,
            totalPages,
            hasNextPage,
            hasPreviousPage,
        };
    }
}
