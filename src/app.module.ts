import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PrismaModule } from './prisma/prisma.module';
import { MetricsModule } from './metrics/metrics.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [SubscriptionsModule, PrismaModule, MetricsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
