import mongoose from 'mongoose';

import log from '../logger';

function connect() {
  const dbUri: string = process.env.MONGO_CONNECTION_STRING || '';

  return mongoose
    .connect(dbUri, {
    // @ts-ignore
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      log.info('Database connected');
    })
    .catch((error) => {
      log.error('db error', error);
      process.exit(1);
    });
}

export default connect;
