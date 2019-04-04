import express from 'express';
import controller from './../controller/controller';

const router = express();
router.get('/', controller.welcome);


export default router;
