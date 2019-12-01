import { createConnection } from 'typeorm';
import { APP_PORT } from './configs/constants';

createConnection()
  .then(() => import('./configs/App'))
  .then(app =>
    app.default.listen(APP_PORT, () => console.log('Application starter')),
  )
  .catch(err => console.error(err));
