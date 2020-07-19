const appError = require('../../utilis/appError');

const errorHandle = (error) => {
  const message = `Invalid ${error.path}:${error.value}`;
  return new appError(message, 400);
};
const duplicatenameError = (error) => {
  const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Put another value `;
  return new appError(message, 400);
};
const validationError = (error) => {
  const errors = Object.values(error.errors).map((el) => el.message);
  const message = `Invalid Input.${errors.join('.')}`;
  return new appError(message, 400);
};
const JWTERROR = () => {
  return new appError('Invalid Token. Please login again', 401);
};
const TokenExpire = () => {
  return new appError('Token expired. Please login again', 401);
};
const sendDevelopmentError = (error, request, response) => {
  //A) API
  if (request.originalUrl.startsWith('/api')) {
    return response.status(error.statusCode).json({
      status: error.status,
      error: error,
      message: error.message,
      stack: error.stack,
    });
  }
  //B) RENDERED WEBSITE
  console.error('ERROR 💥', error);
  return response
    .status(error.statusCode)
    .render('error', { title: 'Something went wrong!', msg: error.message });
};
const sendProdError = (error, request, response) => {
  //A)  API
  if (request.originalUrl.startsWith('/api')) {
    //A) OPERATIONAL,TRUSTED ERROR
    if (error.isOperational) {
      return response.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    }
    console.error('ERROR 💥', error);
    //B) Programming Error
    return response.status(500).json({
      status: 'error!',
      message: 'Something went wrong!',
    });
  }
  //B) RENDERED WEBSITE
  //A) OPERATIONAL,TRUSTED ERROR
  if (error.isOperational) {
    console.log(error);
    return response.status(error.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: error.message,
    });
  }
  console.error('ERROR 💥', error);
  //B) Programming Error
  return response.status(error.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};
module.exports = (error, request, response, next) => {
  error.status = error.status || 'error!';
  error.statusCode = error.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    sendDevelopmentError(error, request, response);
  } else if (process.env.NODE_ENV === 'production') {
    let tempError = error;
    if (tempError.name === 'CastError') {
      tempError = errorHandle(tempError);
    }
    if (tempError.name === 'ValidationError') {
      tempError = validationError(tempError);
    }
    if (tempError.code === 11000) {
      tempError = duplicatenameError(tempError);
    }
    if (tempError.name === 'JsonWebTokenError') {
      tempError = JWTERROR(tempError);
    }
    if (tempError.name === 'TokenExpiredError') {
      tempError = TokenExpire(tempError);
    }
    sendProdError(tempError, request, response);
  }
};
