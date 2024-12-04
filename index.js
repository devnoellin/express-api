const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const routes = require('./index.route');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', routes);

// 處理全域錯誤訊息 (需放在所有route後面)
app.use(errorMiddleware);

module.exports = app;
