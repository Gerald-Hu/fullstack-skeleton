import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskRouter } from './task.router';

@Module({
  providers: [TaskService, TaskRouter],
  exports: [TaskService],
})
export class TaskModule {}