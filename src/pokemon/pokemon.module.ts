import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PokemonController } from './controller/pokemon.controller';
import { PokemonRepository } from './repository/pokemon.repository';
import { PokemonService } from './service/pokemon.service';


@Module({
  imports: [],
  controllers: [PokemonController],
  providers: [PrismaService, PokemonRepository, PokemonService],
})
export class PokemonModule {}