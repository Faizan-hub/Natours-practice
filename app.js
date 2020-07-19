const morgan = require('morgan');
const express = require('express');
const toursRouter = require('D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/route/toursRouter');
const usersRouter = require('D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/route/usersRouter');
const reviewRouter = require('D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/route/reviewRoute');
const viewsRouter = require('D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/route/viewsRouter');
const bookingRoute = require('D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/route/bookingRoute');

const appError = require('D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/utilis/appError');
const errorHandler = require('D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/route/controller/errorController');
const { response, request } = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss_clesn = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
//Middlewares

app.set('view engine', 'pug');
app.set(
  'views',
  'D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/dev-data/views'
);
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const limit = rateLimiter({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests, try again in a hour',
});
app.use('/api', limit);
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss_clesn());
app.use(
  hpp({
    whitelist: [
      'ratingsAverage',
      'ratingsQuantity',
      'difficulty',
      'maxGroupSize',
      'price',
      'duration',
    ],
  })
);
app.use((request, response, next) => {
  request.Time = new Date().toISOString();
  next();
});
app.use(
  express.static(
    'D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/public'
  )
);
app.use(express.json({ limit: '10kb' }));
app.use('/', viewsRouter);
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/booking', bookingRoute);
/*app.all('*', (request, response, next) => {
  console.log(request.path);
  next(new appError(`Can't find ${request} on this server!`));
});*/
app.use(errorHandler);

module.exports = app;
