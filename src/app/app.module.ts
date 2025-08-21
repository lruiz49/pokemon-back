import { Module } from '@nestjs/common';
import { MoveModule } from 'src/move/move.module';
import { PokemonModule } from 'src/pokemon/pokemon.module';

@Module({
  imports: [PokemonModule, MoveModule],
  providers: [],
})
export class AppModule {}
