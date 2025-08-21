import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePokemonDto, PokemonDto, UpdatePokemonDto } from "../dto/pokemon.dto";




@Injectable()
export class PokemonRepository {
    findByAbilityId(abilityId: number): PokemonDto[] | PromiseLike<PokemonDto[]> {
        throw new Error("Method not implemented.");
    }  
    constructor(private prisma: PrismaService) { }

    async find(): Promise<PokemonDto[]> {
        return await this.prisma.pokemon.findMany();
    }

    async findOne(id: number): Promise<PokemonDto | null> {
        return await this.prisma.pokemon.findUnique({ where: { id } });
    }

    async create(data: CreatePokemonDto): Promise<PokemonDto> {
        return await this.prisma.pokemon.create({ data });
    }

    async update(id: number, data: UpdatePokemonDto): Promise<PokemonDto> {
        return await this.prisma.pokemon.update({ where: { id }, data });
    }

    async delete(id: number): Promise<void> {
        await this.prisma.pokemon.delete({ where: { id } });
    }

    async findOneByName(name: string): Promise<PokemonDto | null> {
        return await this.prisma.pokemon.findUnique({ where: { name } });
    }

    async findByMoveId(moveId: number): Promise<PokemonDto[]> {
        return await this.prisma.pokemon.findMany({ where: { moves: { some: { id: moveId } } } });
    }
}