import { Tedis } from 'tedis';
import { REDIS_CONNECTION } from './constants';

const redis = new Tedis(REDIS_CONNECTION);

export default redis;
