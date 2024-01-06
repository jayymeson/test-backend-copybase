import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [SubscriptionsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
