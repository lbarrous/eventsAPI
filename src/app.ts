import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { /* deserializeUser, */ notFound, errorHandler } from './middlewares';

dotenv.config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* app.use(deserializeUser); */
app.use(notFound);
app.use(errorHandler);

export default app;
