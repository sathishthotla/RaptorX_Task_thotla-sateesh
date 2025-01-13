import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { API_KEYS } from './config/constants';
//import { Cache } from 'cache-manager';
//import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { catchError } from 'rxjs/operators';
import { retryWithDelay } from './utils/retry.strategy';
import axios from 'axios';

@Injectable()
export class WeatherService {
 // constructor(private readonly httpService: HttpService) {}
  constructor(
    private readonly httpService: HttpService,
   // @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

        // const cacheKey = `weather:${city.toLowerCase()}`;

        // Check cache for existing data
        //const cachedData = await this.cacheManager.get(cacheKey);
        //if (cachedData) {
        // console.log(`Cache hit for ${city}`);
        //    return cachedData;
       // }


  async getWeatherByIP(ip: string): Promise<any> {
    try {
      //  Replace with your IP-to-location and weather API logic
      console.log('--------------ip>', ip);
      //console.log('--------------ip>', `https://ipinfo.io/${ip}`);

      const locationUrl = `https://ipinfo.io/${ip}/json?token=${API_KEYS.IPINFO}`;
      
      // retry logic
      //const locationResponse = await this.fetchDataWithRetry(locationUrl, 3, 1);

      const locationResponse = await lastValueFrom(
        this.httpService.get(locationUrl),
      );
      console.log('--------------locationResponse>', locationResponse);

      const { city, country } = locationResponse.data;
      const weatherResponse = await lastValueFrom(
        this.httpService.get(
          'https://api.openweathermap.org/data/2.5/weather',
          {
            params: {
              q: city,
              appid: API_KEYS.OPENWEATHERMAP,
            },
          },
        ),
      );
      const { main, weather } = weatherResponse.data;
        // Cache the response for 10 minutes
        //    await this.cacheManager.set(cacheKey, weatherData, 600);
      //return weatherResponse.data;
      return { 
        ip,
        location: { 
          city, 
          country,
        },
        weather: {
          temperature: main.temp,
          humidity: main.humidity,
          description: weather[0].description,
        },
      };
    } catch (error) {
      throw new Error('Error fetching weather data');
    }
  }

  async fetchDataWithRetry(
    url: string,
    maxRetries = 3,
    delayMs = 1,
  ): Promise<any> {
    console.log('--------------locationResponse>', url);
    return lastValueFrom(
      this.httpService.get(url).pipe(
        retryWithDelay(maxRetries, delayMs),
        catchError((error) => {
          throw new Error(`Failed after retries: ${error.message}`);
        }),
      ),
    );
  }
}
