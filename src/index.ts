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

app.get('/error-more', (req: Request, res: Response) => {
  logger.error('Something went wrong!');
  res.status(500).send('Simulated error more');
});

const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' }
];

const products = [
  { id: 101, name: 'Laptop', price: 999.99 },
  { id: 102, name: 'Smartphone', price: 499.99 },
  { id: 103, name: 'Headphones', price: 149.99 }
];

app.get('/users', (req: Request, res: Response) => {
  logger.info('Fetching all users');
  res.json(users);
});

app.get('/users/:id', (req: Request, res: Response) => {
  const id = parseInt(req?.params?.id as any);
  const user = users.find(u => u.id === id);
  if (user) {
    logger.info(`Found user: ${id}`);
    res.json(user);
  } else {
    logger.warn(`User not found: ${id}`);
    res.status(404).json({ error: 'User not found' });
  }
});



app.get('/products', (req: Request, res: Response) => {
  logger.info('Fetching all products');
  res.json(products);
});

app.get('/products/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const product = products.find(p => p.id === id);
  if (product) {
    logger.info(`Found product: ${id}`);
    res.json(product);
  } else {
    logger.warn(`Product not found: ${id}`);
    res.status(404).json({ error: 'Product not found' });
  }
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

app.get('/delay', async (req: Request, res: Response) => {
  const ms = parseInt(req.query.ms as string) || 1000;
  logger.info(`Starting delayed request: ${ms}ms`);
  await sleep(ms);
  logger.info(`Delayed request finished: ${ms}ms`);
  res.json({ status: 'success', delay: ms });
});

app.get('/random-delay', async (req: Request, res: Response) => {
  const min = parseInt(req.query.min as string) || 100;
  const max = parseInt(req.query.max as string) || 2000;
  const ms = Math.floor(Math.random() * (max - min + 1) + min);
  logger.info(`Starting random delay request: ${ms}ms`);
  await sleep(ms);
  logger.info(`Random delay request finished: ${ms}ms`);
  res.json({ status: 'success', delay: ms });
});

app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});
