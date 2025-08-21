import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MoveController } from './controller/move.controller';
import { MoveRepository } from './repository/move.repository';
import { MoveService } from './service/move.service';



@Module({
  imports: [],
  controllers: [MoveController],
  providers: [PrismaService, MoveRepository, MoveService],
})
export class MoveModule {}