export class ResponseEntity<T> {
  status: string; // "success" or "error"
  message: string;
  data: T;

  constructor(status: string, message: string, data: T) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  static success<T>( 
    data: T,
    message = 'Request successful',
  ): ResponseEntity<T> {
    return new ResponseEntity('success', message, data);
  }

  static error<T>(message: string, data: T = null): ResponseEntity<T> {
    return new ResponseEntity('error', message, data);
  }
}  
