import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { pokemon } from '../dto/pokemon.dto';

@Controller('pokemon')
export class PokemonController {
  @Post()
  log(@Body() pokemon: pokemon){
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}