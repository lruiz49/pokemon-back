import { validate } from 'class-validator';
import { CreateAbilityDto, UpdateAbilityDto, AbilityDto } from '../../../src/ability/dto/ability.dto';

describe('AbilityDto Validation', () => {
  describe('CreateAbilityDto', () => {
    it('should pass validation with valid data', async () => {
      const dto = new CreateAbilityDto();
      dto.name = 'Static';
      dto.description = 'Prevents paralysis';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation without name', async () => {
      const dto = new CreateAbilityDto();
      dto.description = 'Prevents paralysis';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
    });

    it('should fail validation without description', async () => {
      const dto = new CreateAbilityDto();
      dto.name = 'Static';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('description');
    });

    it('should fail validation with non-string name', async () => {
      const dto = new CreateAbilityDto();
      (dto as any).name = 123;
      dto.description = 'Prevents paralysis';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
    });

    it('should fail validation with non-string description', async () => {
      const dto = new CreateAbilityDto();
      dto.name = 'Static';
      (dto as any).description = 123;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('description');
    });
  });

  describe('UpdateAbilityDto', () => {
    it('should pass validation with partial data', async () => {
      const dto = new UpdateAbilityDto();
      dto.name = 'Lightning Rod';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with empty object', async () => {
      const dto = new UpdateAbilityDto();

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid types', async () => {
      const dto = new UpdateAbilityDto();
      (dto as any).name = 123;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
    });
  });
});
