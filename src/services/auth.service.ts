import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { UserEntity, TokenEntity } from '../entities';
import RequestError from '../helpers/requestError';
import { JWT, HEADER_CLIENT_IP } from '../configs/constants';

class AuthService {
  private readonly _userRepository: Repository<UserEntity>;
  private readonly _tokenRepository: Repository<TokenEntity>;

  constructor() {
    this._userRepository = getRepository(UserEntity);
    this._tokenRepository = getRepository(TokenEntity);
  }

  signIn = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const ip: any = req.headers[HEADER_CLIENT_IP];
    const userAgent: any = req.headers['user-agent'];

    const user = await this._userRepository.findOne({ username });

    if (!user) {
      throw new RequestError(404, 'User not found');
    }

    if (user.password !== password) {
      throw new RequestError(400, 'Wrong password');
    }

    const accessToken = jwt.sign(
      { id: user.id, username },
      JWT.secret,
      JWT.access,
    );

    const refreshToken = jwt.sign(
      { id: user.id, username },
      JWT.secret,
      JWT.refresh,
    );

    await this._tokenRepository.save({
      token: refreshToken,
      ip,
      userAgent,
      user,
      expiredAt: moment().add(JWT.refresh.expiresIn, 'second'),
    });

    return res.json({
      accessToken: { token: accessToken, expiresIn: JWT.access.expiresIn },
      refreshToken,
    });
  };

  info = async (req: Request, res: Response) => {
    const { id } = res.locals.user;

    const user = await this._userRepository.findOne(id);

    return res.json(user);
  };

  refreshToken = async (req: Request, res: Response) => {
    const { token } = req.body;
    const ip: any = req.headers[HEADER_CLIENT_IP];
    const userAgent: any = req.headers['user-agent'];

    const existToken: any = await this._tokenRepository.findOne({
      where: { token },
      relations: ['user'],
    });

    if (!existToken) {
      throw new RequestError(404, 'Refresh token not found');
    }

    const jwtPayload: any = jwt.verify(token, JWT.secret);

    if (jwtPayload.id !== existToken.user.id) {
      throw new RequestError(400, 'User does not match');
    }

    if (ip !== existToken.ip) {
      throw new RequestError(400, 'IP does not match');
    }

    const accessToken = jwt.sign(
      { id: existToken.user.id, username: existToken.user.username },
      JWT.secret,
      JWT.access,
    );

    const refreshToken = jwt.sign(
      { id: existToken.user.id, username: existToken.user.username },
      JWT.secret,
      JWT.refresh,
    );

    await this._tokenRepository.save({
      token: refreshToken,
      ip,
      userAgent,
      user: existToken.user,
      expiredAt: moment().add(JWT.refresh.expiresIn, 'second'),
    });

    return res.json({
      accessToken: { token: accessToken, expiresIn: JWT.access.expiresIn },
      refreshToken,
    });
  };
}

export default new AuthService();
