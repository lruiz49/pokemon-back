import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class PokemonController {
  

  @Get()
  //@ApiOperation({ summary: 'Get all users' })
  /*@ApiResponse({
    status: 200,
    description: 'Return all users',
    type: [UserDto],
  })*/
  getUsers(): String {
    return "hello";
  }
}