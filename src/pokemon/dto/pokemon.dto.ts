import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger"
import { ArrayMaxSize, ArrayUnique, IsArray, IsDate, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUrl } from "class-validator"
import { Type as TransformType } from "class-transformer";
import { Type } from '@prisma/client';


export class CreatePokemonDto {

    @ApiProperty({ description: "Pokemon name" })
    @IsString()
    name!: string;

    @ApiPropertyOptional({ description: "Description of pokemon" })
    @IsOptional()
    @IsString()
    description?: string | null;

    @ApiProperty({ description: "Pokemon main type", enum: Type, enumName: "Type" })
    @IsEnum(Type)
    type1!: Type;

    @ApiPropertyOptional({ description: "Pokemon secondary type", enum: Type, enumName: "Type" })
    @IsOptional()
    @IsEnum(Type)
    type2?: Type | null;

    @ApiProperty({ description: "Pokemon height in cm (Int)" })
    @TransformType(() => Number)
    @IsInt()
    height!: number;

    @ApiProperty({ description: "Pokemon weight in kg ", example: 12.34 })
    @TransformType(() => Number)
    @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
    weight!: number;

    @ApiProperty({ description: "Pokemon image URL" })
    @IsUrl()
    imageUrl!: string;


    @ApiPropertyOptional({ description: "Pokemon ability id" })
    @TransformType(() => Number)
    @IsOptional()
    @IsInt()
    abilityId?: number | null;

    @ApiPropertyOptional({
        description: "IDs of existing moves (max 4)",
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
    @ApiProperty({ description: "Pokemon ID" })
    @IsInt()
    id!: number;

    @ApiProperty({description: "Pokemon created date" })
    @TransformType(() => Date)
    @IsDate()
    createdAt!: Date;

    @ApiProperty({description: "Pokemon updated date" })
    @TransformType(() => Date)
    @IsDate()
    updatedAt!: Date;
}

export class UpdatePokemonDto extends PartialType(CreatePokemonDto) {}