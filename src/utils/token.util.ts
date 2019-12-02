import jwt from 'jsonwebtoken';
import { getRepository, Repository } from 'typeorm';
import moment from 'moment';
import redis from '../configs/redis';
import { JWT } from '../configs/constants';
import { TokenEntity, UserEntity } from '../entities';
import RequestError from '../helpers/requestError';

export class TokenUtil {
  private readonly _tokenRepository: Repository<TokenEntity>;

  constructor() {
    this._tokenRepository = getRepository(TokenEntity);
  }

  generate = async (user: UserEntity, ip: any, userAgent: any) => {
    const accessToken: string = jwt.sign(
      { id: user.id, username: user.username },
      JWT.secret,
      JWT.access,
    );

    const refreshToken: string = jwt.sign(
      { id: user.id, username: user.username },
      JWT.secret,
      JWT.refresh,
    );

    const savedToken: TokenEntity = await this._tokenRepository.save({
      token: refreshToken,
      ip,
      userAgent,
      user,
      expiredAt: moment().add(JWT.refresh.expiresIn, 'second'),
    });

    await redis.setex(
      refreshToken,
      JWT.refresh.expiresIn,
      savedToken.id.toString(),
    );

    return {
      accessToken: { token: accessToken, expiresIn: JWT.access.expiresIn },
      refreshToken,
    };
  };

  refresh = async (refreshToken: string, ip: any, userAgent: any) => {
    const tokenId: any = await redis.get(refreshToken);

    if (!tokenId) {
      throw new RequestError(404, 'Refresh token not found in redis');
    }

    const existToken: any = await this._tokenRepository.findOne({
      where: { id: tokenId },
      relations: ['user'],
    });

    if (!existToken) {
      throw new RequestError(404, 'Refresh token not found in db');
    }

    if (existToken.ip !== ip) {
      throw new RequestError(401, 'Ip does not match');
    }

    const jwtPayload: any = jwt.verify(refreshToken, JWT.secret);

    if (jwtPayload.id !== existToken.user.id) {
      throw new RequestError(401, 'user does not match');
    }

    if (moment().isAfter(existToken.expiredAt)) {
      throw new RequestError(401, 'Refresh token is expired');
    }

    await redis.del(refreshToken);

    const tokens = await this.generate(existToken.user, ip, userAgent);

    return tokens;
  };
}
