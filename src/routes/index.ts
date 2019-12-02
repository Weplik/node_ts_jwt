import { Router } from 'express';
import { AuthController, PublicController } from '../controllers';
import { UserController } from '../controllers/user.controller';

class Routes {
  private readonly _router: Router = Router();
  private readonly _authController = new AuthController();
  private readonly _publicController = new PublicController();
  private readonly _userController = new UserController();

  constructor() {
    this._router.use('/public', this._publicController.router);
    this._router.use('/auth', this._authController.router);
    this._router.use('/user', this._userController.router);
  }

  get router(): Router {
    return this._router;
  }
}

export default new Routes();
