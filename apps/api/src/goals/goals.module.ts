import { Module } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsRouter } from './goals.router';

@Module({
  providers: [GoalsService, GoalsRouter],
  exports: [GoalsService],
})
export class GoalsModule {}
