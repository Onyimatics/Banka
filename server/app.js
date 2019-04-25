// eslint-disable-next-line no-console
import express from 'express';
import bodyparser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import routes from './route/index';
import swaggerdoc from '../swagger.json';


const app = express();
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use('/api/v2/', routes);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerdoc));

app.all('*', (req, res) => {
  res.status(404).json({
    status: '404',
    message: 'Page Not Found',
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`App is running on ${port}`);
});

export default app;
