import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDate, IsInt, IsString } from 'class-validator';
import { Type as TransformType } from 'class-transformer';

export class CreateAbilityDto {
  @ApiProperty({ description: 'Ability name' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Description of ability' })
  @IsString()
  description!: string;
}

export class AbilityDto extends CreateAbilityDto {
  @ApiProperty({ description: 'Ability ID' })
  @IsInt()
  id!: number;

  @ApiProperty({ description: 'Ability created date' })
  @TransformType(() => Date)
  @IsDate()
  createdAt!: Date;

  @ApiProperty({ description: 'Ability updated date' })
  @TransformType(() => Date)
  @IsDate()
  updatedAt!: Date;
}

export class UpdateAbilityDto extends PartialType(CreateAbilityDto) {}
