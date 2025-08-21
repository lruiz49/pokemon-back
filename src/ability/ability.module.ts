import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AbilityRepository } from './repository/ability.repository';
import { AbilityService } from './service/ability.service';
import { AbilityController } from './controller/ability.controller';

@Module({
  imports: [],
  controllers: [AbilityController],
  providers: [PrismaService, AbilityRepository, AbilityService],
})
export class AbilityModule {}