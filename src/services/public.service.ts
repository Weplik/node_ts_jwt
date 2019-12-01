import { Request, Response } from 'express';

class PublicService {
  public helloWorld(req: Request, res: Response) {
    return res.json({ message: 'hello world' });
  }
}

export default new PublicService();
