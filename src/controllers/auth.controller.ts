import { Router } from 'express';
import service from '../services/auth.service';
import asyncHandler from 'express-async-handler'
import middleware from '../middleware';

export class AuthController {
  private readonly _router: Router = Router();

  constructor() {
    this._router.post('/signIn', asyncHandler(service.signIn));
    this._router.get('/info', middleware.auth, asyncHandler(service.info));
    this._router.post('/refresh', asyncHandler(service.refreshToken));
  }

  get router(): Router {
    return this._router;
  }
}
