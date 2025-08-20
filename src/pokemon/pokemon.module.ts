import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PokemonController } from './controller/pokemon.controller';


@Module({
  imports: [],
  controllers: [PokemonController],
  providers: [PrismaService],
})
export class PokemonModule {}