import { Module } from "@nestjs/common";
import { PokemonController } from "../controller/pokemon.controller";


@Module({
  controllers: [PokemonController],
})
export class PokemonModule {}