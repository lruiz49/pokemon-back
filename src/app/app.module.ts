import { Module } from '@nestjs/common';
import { AbilityModule } from 'src/ability/ability.module';
import { MoveModule } from 'src/move/move.module';
import { PokemonModule } from 'src/pokemon/pokemon.module';

@Module({
  imports: [PokemonModule, MoveModule, AbilityModule],
  providers: [],
})
export class AppModule {}
