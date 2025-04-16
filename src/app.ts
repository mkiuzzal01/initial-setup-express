import express, { Request, Response } from 'express';
import cors from 'cors';
// import router from './app/router';

const app = express();
app.use(express.json());
app.use(cors({ origin: ['localhost:5173'] }));
app.use(express.text());

// Home route:
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Health Track');
});

// All application routes:
// app.use('/api/v1/', router);

// This is  just test:
app.get('/', (req: Request, res: Response) => {
  Promise.reject();
  res.send(req);
});

export default app;
