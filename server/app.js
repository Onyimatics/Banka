import express from 'express';
import bodyparser from 'body-parser';
import routes from './route/index';

const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use('/api/v1/', routes);

app.get('/', (req, res) => {
    res.status(200).json("Welcome to Banka");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App is on ${port}`)
});

export default app;

