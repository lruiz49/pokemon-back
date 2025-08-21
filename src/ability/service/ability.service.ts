import { Injectable } from "@nestjs/common";
import { AbilityDto, CreateAbilityDto, UpdateAbilityDto } from "../dto/ability.dto";
import { AbilityRepository } from "../repository/ability.repository";


@Injectable()
export class AbilityService {
    constructor(private readonly abilityRepository: AbilityRepository) { }

    async getAllAbilities(): Promise<AbilityDto[]> {
        return this.abilityRepository.find();
    }

    getAbilityById(id: number): Promise<AbilityDto> {
        return this.abilityRepository.findOne(id);
    }

    async createAbility(createAbilityDto: CreateAbilityDto): Promise<AbilityDto> {
        return this.abilityRepository.create(createAbilityDto);
    }

    async updateAbility(id: number, updateAbilityDto: UpdateAbilityDto): Promise<AbilityDto> {
        return this.abilityRepository.update(id, updateAbilityDto);
    }

    async deleteAbility(id: number): Promise<AbilityDto> {
        return this.abilityRepository.delete(id);
    }
}