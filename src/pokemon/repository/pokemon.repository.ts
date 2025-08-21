import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePokemonDto, PokemonDto, UpdatePokemonDto } from "../dto/pokemon.dto";
import { Type } from "@prisma/client";




@Injectable()
export class PokemonRepository {

    
    constructor(private prisma: PrismaService) { }

    async find(): Promise<PokemonDto[]> {
        return await this.prisma.pokemon.findMany();
    }

    async findOne(id: number): Promise<PokemonDto > {
        return await this.prisma.pokemon.findUniqueOrThrow({ where: { id } });
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


    async findByMoveId(moveId: number): Promise<PokemonDto[]> {
        return await this.prisma.pokemon.findMany({ where: { moves: { some: { id: moveId } } } });
    }

    async findByAbilityId(abilityId: number): Promise<PokemonDto[]> {
        return await this.prisma.pokemon.findMany({ where: { abilityId: abilityId } });
    }

    async findByType(type: Type): Promise<PokemonDto[]> {
        return await this.prisma.pokemon.findMany({
            where: {
                OR: [
                    { type1: type },
                    { type2: type }
                ] 
            }
        });
    }
}