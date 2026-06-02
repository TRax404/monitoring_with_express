import express, { Request, Response } from 'express';
import logger from './logger.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to log requests with duration and metadata
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request processed', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
      contentLength: res.get('Content-Length'),
    });
  });
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express with Loki logging!');
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'UP', timestamp: new Date().toISOString() });
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
  logger.error('Simulated internal server error');
  res.status(500).send('Simulated error');
});

app.get('/test/error-rate', (req: Request, res: Response) => {
  const rate = parseFloat(req.query.rate as string) || 0.5;
  if (Math.random() < rate) {
    logger.error('Simulated random error', { rate });
    res.status(500).json({ status: 'error', message: 'Randomly failed', rate });
  } else {
    res.json({ status: 'success', message: 'Randomly succeeded', rate });
  }
});

app.get('/test/not-found', (req: Request, res: Response) => {
  logger.warn('Simulated 404 error');
  res.status(404).json({ error: 'Resource not found' });
});

app.get('/test/unauthorized', (req: Request, res: Response) => {
  logger.warn('Simulated 401 error');
  res.status(401).json({ error: 'Unauthorized access' });
});

app.get('/test/heavy', (req: Request, res: Response) => {
  const size = parseInt(req.query.size as string) || 1000;
  const data = 'A'.repeat(size * 1024); // Size in KB
  res.json({ status: 'success', size_kb: size, data_preview: data.substring(0, 100) });
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
  res.json(users);
});

app.get('/users/:id', (req: Request, res: Response) => {
  const id = parseInt(req?.params?.id as any);
  const user = users.find(u => u.id === id);
  if (user) {
    res.json(user);
  } else {
    logger.warn(`User not found: ${id}`);
    res.status(404).json({ error: 'User not found' });
  }
});

app.get('/products', (req: Request, res: Response) => {
  res.json(products);
});

app.get('/products/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const product = products.find(p => p.id === id);
  if (product) {
    res.json(product);
  } else {
    logger.warn(`Product not found: ${id}`);
    res.status(404).json({ error: 'Product not found' });
  }
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

app.get('/delay', async (req: Request, res: Response) => {
  const ms = parseInt(req.query.ms as string) || 1000;
  await sleep(ms);
  res.json({ status: 'success', delay: ms });
});

app.get('/random-delay', async (req: Request, res: Response) => {
  const min = parseInt(req.query.min as string) || 100;
  const max = parseInt(req.query.max as string) || 2000;
  const ms = Math.floor(Math.random() * (max - min + 1) + min);
  await sleep(ms);
  res.json({ status: 'success', delay: ms });
});

app.get('/test/latency', async (req: Request, res: Response) => {
  const distribution = req.query.dist as string || 'normal';
  let ms = 100;

  if (distribution === 'slow') {
    ms = Math.floor(Math.random() * 3000) + 2000; // 2-5s
  } else if (distribution === 'flaky') {
    ms = Math.random() < 0.2 ? 5000 : 50; // 20% chance of 5s, else 50ms
  } else {
    ms = Math.floor(Math.random() * 400) + 100; // 100-500ms
  }

  await sleep(ms);
  res.json({ status: 'success', distribution, delay: ms });
});

app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});
