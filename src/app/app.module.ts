import { Module } from '@nestjs/common';
import { PokemonModule } from 'src/testPokemon/module/pokemon.module';

@Module({
  imports: [PokemonModule],
  providers: [],
})
export class AppModule {}
