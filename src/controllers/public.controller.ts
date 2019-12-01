import { Router } from 'express';
import service from '../services/public.service';

export class PublicController {
  private readonly _router: Router = Router();

  constructor() {
    this._router.get('/', service.helloWorld);
  }

  get router(): Router {
    return this._router;
  }
}
