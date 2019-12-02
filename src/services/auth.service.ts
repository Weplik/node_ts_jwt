import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';
import { UserEntity } from '../entities';
import RequestError from '../helpers/requestError';
import { HEADER_CLIENT_IP } from '../configs/constants';
import { TokenUtil } from '../utils/token.util';

class AuthService {
  private readonly _userRepository: Repository<UserEntity>;
  private readonly _tokenUtil: TokenUtil;

  constructor() {
    this._userRepository = getRepository(UserEntity);
    this._tokenUtil = new TokenUtil();
  }

  signIn = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const userIp: any = req.headers[HEADER_CLIENT_IP];
    const userAgent: any = req.headers['user-agent'];

    const user: any = await this._userRepository.findOne({ username });

    if (!user) {
      throw new RequestError(404, 'User not found');
    }

    if (user.password !== password) {
      throw new RequestError(400, 'Wrong password');
    }

    const tokens: any = await this._tokenUtil.generate(user, userIp, userAgent);

    return res.json(tokens);
  };

  refreshToken = async (req: Request, res: Response) => {
    const { token } = req.body;
    const userIp: any = req.headers[HEADER_CLIENT_IP];
    const userAgent: any = req.headers['user-agent'];

    const tokens = await this._tokenUtil.refresh(token, userIp, userAgent);

    return res.json(tokens);
  };
}

export default new AuthService();
