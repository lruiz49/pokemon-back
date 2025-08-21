import { Injectable } from "@nestjs/common";
import { AbilityDto, CreateAbilityDto, UpdateAbilityDto } from "../dto/ability.dto";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class AbilityRepository {

    constructor(private prisma: PrismaService) { }

    async find(): Promise<AbilityDto[]> {
        return this.prisma.ability.findMany();
    }

    async findOne(id: number): Promise<AbilityDto> {
        return await this.prisma.ability.findUniqueOrThrow({ where: { id } });
    }
    
    async create(createAbilityDto: CreateAbilityDto): Promise<AbilityDto> {
        return await this.prisma.ability.create({ data: createAbilityDto });
    }

    async update(id: number, updateAbilityDto: UpdateAbilityDto): Promise<AbilityDto> {
        return await this.prisma.ability.update({ where: { id }, data: updateAbilityDto });
    }

    async delete(id: number): Promise<AbilityDto> {
        return await this.prisma.ability.delete({ where: { id } });
    }
}