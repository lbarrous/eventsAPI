import * as http from 'http';
import cron from 'node-cron';
import ioserver, { Socket } from 'socket.io';

import app from './app';
import { getNotificationsHandler } from './controller/user.controller';
import connect from './db/connect';
import log from './logger';
import routes from './routes';

const port: number = parseInt(process.env.PORT as string, 10) || 3000;

const server = http.createServer(app);
const io = new ioserver.Server(server, {
  allowEIO3: true,
  cors: {
    origin: 'http://localhost:4200',
    credentials: true,
  },
});

io.on('connection', (socket: Socket) => {
  console.log('User connected');
  socket.on('notifications', (userId: string) => {
    console.log('User: ', userId);
    cron.schedule('* * * * *', async () => {
      const notifications = await getNotificationsHandler(userId);
      socket.emit('notifyEvents', notifications);
      if (notifications.length > 0) {
        socket.emit('notifyEvents', notifications);
      }
    });
  });
});

server.listen(port, () => {
  /* eslint-disable no-console */
  log.info(`Server listing at http://localhost:${port}`);
  /* eslint-enable no-console */
  connect();
  routes(app);
});
