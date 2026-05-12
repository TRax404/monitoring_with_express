import express, { Request, Response } from 'express';
import logger from './logger.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to log requests
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.get('/', (req: Request, res: Response) => {
  logger.info('Accessing root endpoint');
  res.send('Hello, Express with Loki logging!');
});

app.get('/test-log', (req: Request, res: Response) => {
  const level = req.query.level as string || 'info';
  const message = req.query.message as string || 'This is a test log message';

  switch (level) {
    case 'error':
      logger.error(message);
      break;
    case 'warn':
      logger.warn(message);
      break;
    default:
      logger.info(message);
  }

  res.json({ status: 'Logged', level, message });
});

app.get('/error', (req: Request, res: Response) => {
  logger.error('Something went wrong!');
  res.status(500).send('Simulated error');
});

app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});
