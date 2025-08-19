import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class pokemon{

    @IsNumber()
    name: Number
}