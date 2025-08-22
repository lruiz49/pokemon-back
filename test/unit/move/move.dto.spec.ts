import { validate } from 'class-validator';
import { CreateMoveDto, UpdateMoveDto, MoveDto } from '../../../src/move/dto/move.dto';
import { MoveCategory, Type } from '@prisma/client';

describe('MoveDto Validation', () => {
  describe('CreateMoveDto', () => {
    it('should pass validation with valid data', async () => {
      const dto = new CreateMoveDto();
      dto.name = 'Thunderbolt';
      dto.description = 'Electric attack';
      dto.type = Type.ELECTRIC;
      dto.category = MoveCategory.SPECIAL;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation without optional description', async () => {
      const dto = new CreateMoveDto();
      dto.name = 'Thunderbolt';
      dto.type = Type.ELECTRIC;
      dto.category = MoveCategory.SPECIAL;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation without name', async () => {
      const dto = new CreateMoveDto();
      dto.description = 'Electric attack';
      dto.type = Type.ELECTRIC;
      dto.category = MoveCategory.SPECIAL;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
    });

    it('should fail validation without type', async () => {
      const dto = new CreateMoveDto();
      dto.name = 'Thunderbolt';
      dto.description = 'Electric attack';
      dto.category = MoveCategory.SPECIAL;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('type');
    });

    it('should fail validation without category', async () => {
      const dto = new CreateMoveDto();
      dto.name = 'Thunderbolt';
      dto.description = 'Electric attack';
      dto.type = Type.ELECTRIC;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('category');
    });

    it('should fail validation with invalid type enum', async () => {
      const dto = new CreateMoveDto();
      dto.name = 'Thunderbolt';
      dto.description = 'Electric attack';
      (dto as any).type = 'INVALID_TYPE';
      dto.category = MoveCategory.SPECIAL;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('type');
    });

    it('should fail validation with invalid category enum', async () => {
      const dto = new CreateMoveDto();
      dto.name = 'Thunderbolt';
      dto.description = 'Electric attack';
      dto.type = Type.ELECTRIC;
      (dto as any).category = 'INVALID_CATEGORY';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('category');
    });
  });

  describe('UpdateMoveDto', () => {
    it('should pass validation with partial data', async () => {
      const dto = new UpdateMoveDto();
      dto.name = 'Thunder';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with empty object', async () => {
      const dto = new UpdateMoveDto();

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid enum values', async () => {
      const dto = new UpdateMoveDto();
      (dto as any).type = 'INVALID_TYPE';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('type');
    });
  });
});
