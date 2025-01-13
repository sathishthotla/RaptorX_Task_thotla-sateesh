import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './weather.module';
//import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
//import * as redisStore from 'cache-manager-redis-store';
@Module({
  imports: [WeatherModule,
   
  ],
  controllers: [AppController],
  providers: [AppService],
}) 
export class AppModule {}
