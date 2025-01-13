import { Observable, throwError, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export function retryWithDelay(maxRetries: number, delayMs: number): any {
  return (attempts: Observable<any>) => {
    return attempts.pipe(
      mergeMap((error, i) => {
        const attempt = i + 1;

        if (attempt > maxRetries) {
          return throwError(() => new Error(`Retry limit exceeded: ${error.message}`));
        }

        const delayTime = delayMs * Math.pow(2, i); 
        console.warn(`Retrying attempt ${attempt} in ${delayTime}ms...`);
        return timer(delayTime);
      }),
    );  
  };
}
