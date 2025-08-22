import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  Max,
} from 'class-validator';
import { Type as TransformType } from 'class-transformer';
import { Type } from '@prisma/client';

export class CreatePokemonDto {
  @ApiProperty({ description: 'Pokemon name' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Description of pokemon' })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({
    description: 'Pokemon main type',
    enum: Type,
    enumName: 'Type',
  })
  @IsEnum(Type)
  type1!: Type;

  @ApiPropertyOptional({
    description: 'Pokemon secondary type',
    enum: Type,
    enumName: 'Type',
  })
  @IsOptional()
  @IsEnum(Type)
  type2?: Type | null;

  @ApiProperty({ description: 'Pokemon height in cm (Int)' })
  @TransformType(() => Number)
  @IsInt()
  height!: number;

  @ApiProperty({ description: 'Pokemon weight in kg ', example: 12.34 })
  @TransformType(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  weight!: number;

  @ApiProperty({ description: 'Pokemon image URL' })
  @IsUrl()
  imageUrl!: string;

  @ApiPropertyOptional({ description: 'Pokemon ability id' })
  @TransformType(() => Number)
  @IsOptional()
  @IsInt()
  abilityId?: number | null;

  @ApiPropertyOptional({
    description: 'IDs of existing moves (max 4)',
    maxItems: 4,
    example: [1, 5, 42],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(4)
  @TransformType(() => Number)
  @IsInt({ each: true })
  moveIds?: number[];
}

export class PokemonDto extends CreatePokemonDto {
  @ApiProperty({ description: 'Pokemon ID' })
  @IsInt()
  id!: number;

  @ApiProperty({ description: 'Pokemon created date' })
  @TransformType(() => Date)
  @IsDate()
  createdAt!: Date;

  @ApiProperty({ description: 'Pokemon updated date' })
  @TransformType(() => Date)
  @IsDate()
  updatedAt!: Date;
}

export class UpdatePokemonDto extends PartialType(CreatePokemonDto) {}

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Page number (starting from 1)',
    default: 1,
    minimum: 1,
  })
  @TransformType(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @TransformType(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Array of items' })
  data!: T[];

  @ApiProperty({ description: 'Total number of items' })
  total!: number;

  @ApiProperty({ description: 'Current page number' })
  page!: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit!: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages!: number;

  @ApiProperty({ description: 'Whether there is a next page' })
  hasNextPage!: boolean;

  @ApiProperty({ description: 'Whether there is a previous page' })
  hasPreviousPage!: boolean;
}
