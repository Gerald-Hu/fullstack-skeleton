import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TRPCModule } from 'nestjs-trpc';
import { DogsRouter } from "./hi/hi.router"; 
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppContext } from "./app.context";

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
  ],
  controllers: [AppController],
  providers: [AppService, AppContext, DogsRouter],
})
export class AppModule {}
