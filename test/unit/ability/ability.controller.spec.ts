import { Test } from '@nestjs/testing';
import { AbilityController } from '../../../src/ability/controller/ability.controller';
import { AbilityService } from '../../../src/ability/service/ability.service';
import { CreateAbilityDto, UpdateAbilityDto, AbilityDto } from '../../../src/ability/dto/ability.dto';

type ServiceMock = jest.Mocked<AbilityService>;

function makeAbility(overrides: Partial<any> = {}) {
  const now = new Date();
  return {
    id: 1,
    name: 'Static',
    description: 'Prevents paralysis',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

async function setup() {
  const service: ServiceMock = {
    getAllAbilities: jest.fn(),
    getAbilityById: jest.fn(),
    createAbility: jest.fn(),
    updateAbility: jest.fn(),
    deleteAbility: jest.fn(),
  } as unknown as ServiceMock;

  const moduleRef = await Test.createTestingModule({
    controllers: [AbilityController],
    providers: [{ provide: AbilityService, useValue: service }],
  }).compile();

  return {
    controller: moduleRef.get(AbilityController),
    service: moduleRef.get(AbilityService),
  };
}

describe('AbilityController', () => {
  let controller: AbilityController;
  let service: ServiceMock;

  beforeEach(async () => {
    const setup_result = await setup();
    controller = setup_result.controller;
    service = setup_result.service as ServiceMock;
  });

  afterEach(() => jest.clearAllMocks());

  it('GET /ability -> returns list', async () => {
    const mockAbilities = [makeAbility({ name: 'Static' })];
    service.getAllAbilities.mockResolvedValue(mockAbilities);

    const res = await controller.getAbilities();

    expect(res).toEqual(mockAbilities);
    expect(service.getAllAbilities).toHaveBeenCalledTimes(1);
  });

  it('GET /ability/:id -> returns item', async () => {
    service.getAbilityById.mockResolvedValue(
      makeAbility({ id: 42, name: 'Levitate' }),
    );

    const res = await controller.getAbility(42);

    expect(res.id).toBe(42);
    expect(service.getAbilityById).toHaveBeenCalledWith(42);
  });

  it('GET /ability/:id -> throws NotFoundException when service says not found', async () => {
    service.getAbilityById.mockRejectedValue(new Error('Ability not found'));

    await expect(controller.getAbility(999)).rejects.toThrow(
      'Ability not found',
    );
  });

  it('POST /ability -> creates', async () => {
    const dto: CreateAbilityDto = {
      name: 'Overgrow',
      description: 'Powers up Grass-type moves',
    };
    service.createAbility.mockResolvedValue(
      makeAbility({ id: 10, name: 'Overgrow' }),
    );

    const res = await controller.createAbility(dto);

    expect(res.id).toBe(10);
    expect(service.createAbility).toHaveBeenCalledWith(dto);
  });

  it('POST /ability -> throws DuplicateAbilityException', async () => {
    service.createAbility.mockRejectedValue(
      new Error('Ability already exists'),
    );

    const dto: CreateAbilityDto = {
      name: 'Static',
      description: 'Prevents paralysis',
    };

    await expect(controller.createAbility(dto)).rejects.toThrow(
      'Ability already exists',
    );
  });

  it('PATCH /ability/:id -> updates', async () => {
    service.updateAbility.mockResolvedValue(
      makeAbility({ id: 1, name: 'Lightning Rod' }),
    );

    const updateDto: UpdateAbilityDto = { name: 'Lightning Rod' };
    const res = await controller.updateAbility(1, updateDto);

    expect(res.name).toBe('Lightning Rod');
    expect(service.updateAbility).toHaveBeenCalledWith(1, updateDto);
  });

  it('PATCH /ability/:id -> throws NotFoundException when ability not found', async () => {
    service.updateAbility.mockRejectedValue(new Error('Ability not found'));
    const updateDto: UpdateAbilityDto = { name: 'Lightning Rod' };

    await expect(controller.updateAbility(999, updateDto)).rejects.toThrow(
      'Ability not found',
    );
  });

  it('DELETE /ability/:id -> deletes', async () => {
    service.deleteAbility.mockResolvedValue(makeAbility({ id: 7 }));

    await controller.deleteAbility(7);

    expect(service.deleteAbility).toHaveBeenCalledWith(7);
  });

  it('DELETE /ability/:id -> throws NotFoundException when ability not found', async () => {
    service.deleteAbility.mockRejectedValue(new Error('Ability not found'));

    await expect(controller.deleteAbility(999)).rejects.toThrow(
      'Ability not found',
    );
  });
});
