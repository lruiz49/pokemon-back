import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { MoveCategory, Type } from '@prisma/client';
import { IsDate, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Type as TransformType } from 'class-transformer';

export class CreateMoveDto {
  @ApiProperty({ description: 'Move name' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Move description' })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({ description: 'Move type', enum: Type, enumName: 'Type' })
  @IsEnum(Type)
  type!: Type;

  @ApiProperty({
    description: 'Move category',
    enum: MoveCategory,
    enumName: 'MoveCategory',
  })
  @IsEnum(MoveCategory)
  category!: MoveCategory;
}

export class MoveDto extends CreateMoveDto {
  @ApiProperty({ description: 'Move ID' })
  @IsInt()
  id!: number;

  @ApiProperty({ description: 'Move created date' })
  @TransformType(() => Date)
  @IsDate()
  createdAt!: Date;

  @ApiProperty({ description: 'Move updated date' })
  @TransformType(() => Date)
  @IsDate()
  updatedAt!: Date;
}

export class UpdateMoveDto extends PartialType(CreateMoveDto) {}
