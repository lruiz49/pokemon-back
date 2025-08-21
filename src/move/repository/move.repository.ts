import { PrismaService } from "src/prisma/prisma.service";
import { CreateMoveDto, MoveDto, UpdateMoveDto } from "../dto/move.dto";
import { PokemonDto } from "src/pokemon/dto/pokemon.dto";
import { Injectable } from "@nestjs/common";
import { MoveCategory, Type } from "@prisma/client";

@Injectable()
export class MoveRepository {


    constructor(private prisma: PrismaService) { }

    async find(): Promise<MoveDto[]> {
        return await this.prisma.move.findMany();
    }

    async findOne(id: number): Promise<MoveDto> {
        return await this.prisma.move.findUniqueOrThrow({ where: { id } });
    }

    async create(data: CreateMoveDto): Promise<MoveDto> {
        return await this.prisma.move.create({ data });
    }

    async update(id: number, data: UpdateMoveDto): Promise<MoveDto> {
        return await this.prisma.move.update({ where: { id }, data });
    }

    async delete(id: number): Promise<MoveDto> {
        return await this.prisma.move.delete({ where: { id } });
    }

    async findByMoveId(moveId: number): Promise<PokemonDto[]> {
        return await this.prisma.pokemon.findMany({ where: { id: moveId } });
    }

    async findByType(type: Type): Promise<MoveDto[]> {
        return await this.prisma.move.findMany({ where: { type: type } });
    }

    async findByCategory(category: MoveCategory): Promise<MoveDto[]> {
        return await this.prisma.move.findMany({ where: { category: category } });
    }
    
}