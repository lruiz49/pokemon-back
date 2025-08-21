import { Injectable } from "@nestjs/common";
import { CreateMoveDto, MoveDto, UpdateMoveDto } from "../dto/move.dto";
import { MoveRepository } from "../repository/move.repository";
import { MoveCategory, Type } from "@prisma/client";

@Injectable()
export class MoveService {

    constructor(private readonly moveRepository: MoveRepository) { }


    async getAllMoves(): Promise<MoveDto[]> {
        return this.moveRepository.find();
    }
    async getMoveById(id: number): Promise<MoveDto> {
        return this.moveRepository.findOne(id);
    }
    async getAllByType(type: Type): Promise<MoveDto[]> {
        return this.moveRepository.findByType(type);
    }
    async getAllByCategory(category: MoveCategory): Promise<MoveDto[]> {
        return this.moveRepository.findByCategory(category);
    }
    async createMove(createMoveDto: CreateMoveDto): Promise<MoveDto> {
        return this.moveRepository.create(createMoveDto);
    }
    async updateMove(id: number, updateMoveDto: UpdateMoveDto): Promise<MoveDto> {
        return this.moveRepository.update(id, updateMoveDto);
    }
    async deleteMove(id: number): Promise<MoveDto> {
        return this.moveRepository.delete(id);
    }
}