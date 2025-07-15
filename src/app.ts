import express, { Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/utils/NotFound';
import router from './app/router';

const app = express();
app.use(express.json());
app.use(cors({ origin: ['localhost:5173'] }));
app.use(express.text());

// Home route:
app.get('/', (req: Request, res: Response) => {
  res.send({
    message: 'Welcome to the E-commerce API',
    version: '1.0.0',
    date: new Date().toDateString(),
    author: 'MKI_UZZAL',
  });
});

// All application routes:
app.use('/api/v1/', router);

// This is just test:
app.get('/test', (req: Request, res: Response) => {
  Promise.reject();
  res.send(req);
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
