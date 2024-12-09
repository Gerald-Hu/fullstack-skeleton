import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { db } from '../drizzle/client';
import { refreshTokens } from '../drizzle/schema';
import { lt } from 'drizzle-orm';

@Injectable()
export class TokenCleanupService {
  private readonly logger = new Logger(TokenCleanupService.name);

  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredTokens() {
    try {
      const now = new Date();
      const result = await db
        .delete(refreshTokens)
        .where(lt(refreshTokens.expiresAt, now));
      
      this.logger.log(`Cleaned up expired refresh tokens`);
    } catch (error) {
      this.logger.error('Failed to cleanup expired tokens:', error);
    }
  }
}
