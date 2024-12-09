import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthRouter } from './auth.router';
import { UsersModule } from '../users/users.module';
import { TokenCleanupService } from './token-cleanup.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    UsersModule,
    ScheduleModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, AuthRouter, TokenCleanupService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
