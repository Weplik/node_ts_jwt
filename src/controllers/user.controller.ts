import { Router } from 'express';
import service from '../services/user.service';
import asyncHandler from 'express-async-handler'
import middleware from '../middleware';

export class UserController {
  private readonly _router: Router = Router();

  constructor() {
    this._router.get('/info', middleware.auth, asyncHandler(service.info));
  }

  get router(): Router {
    return this._router;
  }
}
