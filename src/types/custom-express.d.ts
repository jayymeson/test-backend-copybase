declare module 'express' {
  export interface Request {
    user?: any;
    headers?: any;
  }
}
