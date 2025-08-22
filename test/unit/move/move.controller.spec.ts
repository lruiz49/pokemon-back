import { Test } from '@nestjs/testing';
import { MoveController } from '../../../src/move/controller/move.controller';
import { MoveService } from '../../../src/move/service/move.service';
import { CreateMoveDto, UpdateMoveDto, MoveDto } from '../../../src/move/dto/move.dto';
import { MoveCategory, Type } from '@prisma/client';

type ServiceMock = jest.Mocked<MoveService>;

function makeMove(overrides: Partial<any> = {}) {
  const now = new Date();
  return {
    id: 1,
    name: 'Thunderbolt',
    description: 'Electric attack',
    type: Type.ELECTRIC,
    category: MoveCategory.SPECIAL,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

async function setup() {
  const service: ServiceMock = {
    getAllMoves: jest.fn(),
    getMoveById: jest.fn(),
    createMove: jest.fn(),
    updateMove: jest.fn(),
    deleteMove: jest.fn(),
    getAllByType: jest.fn(),
    getAllByCategory: jest.fn(),
  } as unknown as ServiceMock;

  const moduleRef = await Test.createTestingModule({
    controllers: [MoveController],
    providers: [{ provide: MoveService, useValue: service }],
  }).compile();

  return {
    controller: moduleRef.get(MoveController),
    service: moduleRef.get(MoveService),
  };
}

describe('MoveController', () => {
  let controller: MoveController;
  let service: ServiceMock;

  beforeEach(async () => {
    const setup_result = await setup();
    controller = setup_result.controller;
    service = setup_result.service as ServiceMock;
  });

  afterEach(() => jest.clearAllMocks());

  it('GET /move -> returns list', async () => {
    const mockMoves = [makeMove({ name: 'Thunderbolt' })];
    service.getAllMoves.mockResolvedValue(mockMoves);

    const res = await controller.getMoves();

    expect(res).toEqual(mockMoves);
    expect(service.getAllMoves).toHaveBeenCalledTimes(1);
  });

  it('GET /move/:id -> returns item', async () => {
    service.getMoveById.mockResolvedValue(
      makeMove({ id: 42, name: 'Surf' }),
    );

    const res = await controller.getMoveById(42);

    expect(res.id).toBe(42);
    expect(service.getMoveById).toHaveBeenCalledWith(42);
  });

  it('GET /move/:id -> throws NotFoundException when service says not found', async () => {
    service.getMoveById.mockRejectedValue(new Error('Move not found'));

    await expect(controller.getMoveById(999)).rejects.toThrow(
      'Move not found',
    );
  });

  it('POST /move -> creates', async () => {
    const dto: CreateMoveDto = {
      name: 'Solar Beam',
      description: 'Two-turn Grass attack',
      type: Type.GRASS,
      category: MoveCategory.SPECIAL,
    };
    service.createMove.mockResolvedValue(
      makeMove({ id: 10, name: 'Solar Beam' }),
    );

    const res = await controller.createMove(dto);

    expect(res.id).toBe(10);
    expect(service.createMove).toHaveBeenCalledWith(dto);
  });

  it('POST /move -> throws DuplicateMoveException', async () => {
    service.createMove.mockRejectedValue(
      new Error('Move already exists'),
    );

    const dto: CreateMoveDto = {
      name: 'Thunderbolt',
      description: 'Electric attack',
      type: Type.ELECTRIC,
      category: MoveCategory.SPECIAL,
    };

    await expect(controller.createMove(dto)).rejects.toThrow(
      'Move already exists',
    );
  });

  it('PATCH /move/:id -> updates', async () => {
    service.updateMove.mockResolvedValue(
      makeMove({ id: 1, name: 'Thunder' }),
    );

    const updateDto: UpdateMoveDto = { name: 'Thunder' };
    const res = await controller.updateMove(1, updateDto);

    expect(res.name).toBe('Thunder');
    expect(service.updateMove).toHaveBeenCalledWith(1, updateDto);
  });

  it('PATCH /move/:id -> throws NotFoundException when move not found', async () => {
    service.updateMove.mockRejectedValue(new Error('Move not found'));
    const updateDto: UpdateMoveDto = { name: 'Thunder' };

    await expect(controller.updateMove(999, updateDto)).rejects.toThrow(
      'Move not found',
    );
  });

  it('DELETE /move/:id -> deletes', async () => {
    service.deleteMove.mockResolvedValue(makeMove({ id: 7 }));

    await controller.deleteMove(7);

    expect(service.deleteMove).toHaveBeenCalledWith(7);
  });

  it('DELETE /move/:id -> throws NotFoundException when move not found', async () => {
    service.deleteMove.mockRejectedValue(new Error('Move not found'));

    await expect(controller.deleteMove(999)).rejects.toThrow(
      'Move not found',
    );
  });
});
