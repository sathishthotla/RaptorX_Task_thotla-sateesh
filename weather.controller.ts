import { Controller, Get, Query, Req } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { Request } from 'express';
import { Default_IP } from './config/constants';
import { ResponseEntity } from './response.entity';
@Controller('weather-by-ip')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getWeatherByIP(@Query('ip') ip: string, @Req() req: Request) {
    try {
      const clientIP = ip || req.ip || req.connection.remoteAddress;
      if (ip != null) {
        const weatherData = await this.weatherService.getWeatherByIP(clientIP);
        return ResponseEntity.success(weatherData);
      } else {
        return ResponseEntity.success(Default_IP.DEFAULT_IP);
      }
    } catch (error) {
      return ResponseEntity.error(error.message); 
    }
  }
} 
