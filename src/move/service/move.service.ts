import { CreateMoveDto, UpdateMoveDto } from "../dto/move.dto";

export class MoveService{
    deleteMove(id: number): void | PromiseLike<void> {
        throw new Error("Method not implemented.");
    }
    getAllMoves(): import("../dto/move.dto").MoveDto[] | PromiseLike<import("../dto/move.dto").MoveDto[]> {
        throw new Error("Method not implemented.");
    }
    updateMove(id: number, updateMoveDto: UpdateMoveDto): import("../dto/move.dto").MoveDto | PromiseLike<import("../dto/move.dto").MoveDto> {
        throw new Error("Method not implemented.");
    }
    createMove(createMoveDto: CreateMoveDto): import("../dto/move.dto").MoveDto | PromiseLike<import("../dto/move.dto").MoveDto> {
        throw new Error("Method not implemented.");
    }
    getAllPokemons(): import("../dto/move.dto").MoveDto[] | PromiseLike<import("../dto/move.dto").MoveDto[]> {
        throw new Error("Method not implemented.");
    }
}