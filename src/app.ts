import express from 'express';

const app = express();
app.use(express.json());
app.use(express.text());

app.get('/', (req, res) => {
  res.send('Hello Health Track');
});


export default app
