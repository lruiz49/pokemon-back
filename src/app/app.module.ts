import { Module } from '@nestjs/common';
import { PokemonModule } from 'src/pokemon/pokemon.module';

@Module({
  imports: [PokemonModule],
  providers: [],
})
export class AppModule {}
