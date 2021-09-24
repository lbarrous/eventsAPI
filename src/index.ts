import app from './app';
import connect from './db/connect';
import log from './logger';
import routes from './routes';

const port: number = parseInt(process.env.PORT as string, 10) || 3000;

app.listen(port, () => {
  /* eslint-disable no-console */
  log.info(`Server listing at http://localhost:${port}`);
  /* eslint-enable no-console */
  connect();
  routes(app);
});
