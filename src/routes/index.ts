import { Router } from 'express';
import { AuthController, PublicController } from '../controllers';

class Routes {
  private readonly _router: Router = Router();
  private readonly _authController = new AuthController();
  private readonly _publicController = new PublicController();

  constructor() {
    this._router.use('/public', this._publicController.router);
    this._router.use('/auth', this._authController.router);
  }

  get router(): Router {
    return this._router;
  }
}

export default new Routes();
