import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import RequestError from '../helpers/requestError';
import { JWT } from '../configs/constants';

class Middleware {
  error = (
    err: RequestError,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const status = err.status || 500;
    return res.status(status).json({ message: err.message });
  };

  auth = (req: Request, res: Response, next: NextFunction) => {
    try {
      const header: any = req.header('Authorization');

      if (!header) {
        throw new RequestError(401, 'Header Authorization not found');
      }

      const token: string =
        header.split(' ').length < 2 ? null : header.split(' ')[1];

      if (!token) {
        throw new RequestError(401, 'Token not found');
      }

      res.locals.user = jwt.verify(token, JWT.secret);
      next();
    } catch (err) {
      next(err);
    }
  };
}

export default new Middleware();
