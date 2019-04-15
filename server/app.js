import express from 'express';
import bodyparser from 'body-parser';
import routes from './route/index';

const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use('/api/v1/', routes);

app.get('/', (req, res) => {
  res.status(200).json({
    status: '200',
    message: 'Welcome to Banka API',
  });
});
app.all('*', (req, res) => {
  res.status(404).json({
    status: '404',
    message: 'Page Not Found',
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
// eslint-disable-next-line no-console
  console.log(`App is running on ${port}`);
});

export default app;
