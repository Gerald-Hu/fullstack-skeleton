import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TRPCModule } from 'nestjs-trpc';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from "./task/task.module";
import { UsersModule } from './users/users.module';
import { AppContext } from "./app.context";
import { GoalsModule } from './goals/goals.module';
import { AgentModule } from "./ai-agent/agent.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "fullstack_dev",
      autoLoadEntities: true,
      synchronize: true, // Don't use in production
    }),
    TRPCModule.forRoot({
      autoSchemaFile: './src/@generated',
      context: AppContext
    }),
    AuthModule,
    UsersModule,
    TaskModule,
    GoalsModule,
    AgentModule
  ],
  controllers: [AppController],
  providers: [AppService, AppContext],
})
export class AppModule {}
