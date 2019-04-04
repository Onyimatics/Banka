import express from 'express';
import bodyparser from 'body-parser';
import router from './route/index';

const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true}));
app.use('/api/v1/', router);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App is on ${port}`)
});

export default app;

