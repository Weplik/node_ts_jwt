import { Request, Response } from 'express';
import { UserEntity } from '../entities';
import { getRepository, Repository } from 'typeorm';

class UserService {
  private readonly _userRepository: Repository<UserEntity>;

  constructor() {
    this._userRepository = getRepository(UserEntity);
  }

  info = async (req: Request, res: Response) => {
    const { id: userId } = res.locals.user;

    const existUser = await this._userRepository.findOne(userId);

    return res.json(existUser);
  };
}

export default new UserService();
