const User = require('D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/models/userModels');
const catchAsync = require('D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/utilis/catchAsync');
const jwt = require('jsonwebtoken');
const { request } = require('../../app');
const { response } = require('express');
const appError = require('../../utilis/appError');
const sendMail = require('D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/utilis/sendEmail');
const { promisify } = require('util');
const crypto = require('crypto');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

const createsendStatus = (user, statusCode, response) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env === 'production') {
    cookieOptions.secure = true;
  }
  response.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  response.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
exports.signUp = catchAsync(async (request, response, next) => {
  const newUser = await User.create({
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
    passwordConfirm: request.body.passwordConfirm,
    passwordChangedAt: request.body.passwordChangedAt,
    //active: request.body.active,
  });
  const url = `${request.protocol}://${request.get('host')}/me`;
  //console.log(url);
  await new sendMail(newUser, url).sendWelcome();
  createsendStatus(newUser, 201, response);
});
exports.logIn = catchAsync(async (request, response, next) => {
  const { email, password } = request.body;
  if (!email || !password) {
    return next(new appError('Please provide email and password', 400));
  }
  const user = await User.findOne({ email }).select('+password');

  const correct = user.correctPassword(password, user.password);
  //const correct = user.correctPassword();

  if (!user || !(await correct)) {
    return next(new appError('Incorrect email or password!', 401));
  }
  createsendStatus(user, 200, response);
});
exports.logOut = async (request, response) => {
  response.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
  });
  response.status(200).json({
    status: 'success',
  });
};
exports.protect = catchAsync(async (request, response, next) => {
  let token = ' ';
  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith('Bearer')
  ) {
    token = request.headers.authorization.split(' ')[1];
  } else if (request.cookies.jwt) {
    token = request.cookies.jwt;
  }
  if (!token) {
    return next(
      new appError("You haven't access to this page.Please login"),
      401
    );
  }
  const decoding = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decoding.id);
  if (!freshUser) {
    return next(
      new appError('The user belonging to this token no longer exist', 401)
    );
  }
  if (await freshUser.passwordchangedafter(decoding.iat)) {
    return next(
      new appError('The password has changed. Please login again', 401)
    );
  }
  response.locals.user = freshUser;
  request.user = freshUser;
  next();
});

exports.Loggedin = async (request, response, next) => {
  if (request.cookies.jwt) {
    try {
      const decoding = await promisify(jwt.verify)(
        request.cookies.jwt,
        process.env.JWT_SECRET
      );
      const freshUser = await User.findById(decoding.id);
      if (!freshUser) {
        return next();
      }

      if (await freshUser.passwordchangedafter(decoding.iat)) {
        return next();
      }
      response.locals.user = freshUser;
      return next();
    } catch (error) {
      return next();
    }
  }

  next();
};

exports.restrictTo = (...roles) => {
  return (request, response, next) => {
    if (!roles.includes(request.user.role)) {
      return next(
        new appError("You don't have premissions to delete this.", 403)
      );
    }
    next();
  };
};
exports.forgetPassword = catchAsync(async (request, response, next) => {
  const user = await User.findOne({ email: request.body.email });
  if (!user) {
    return next(new appError('There is no user with such email', 404));
  }
  const resetToken = user.ResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetUrl = `${request.protocol}://${request.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    await new sendMail(user, resetUrl).resetPassword();
    /*  await sendMail({
      email: user.email,
      subject: 'Your reset password token (valid for 10 mins)',
      message,
    });*/
    response.status(200).json({
      status: 'Success',
      message: 'Token sent to your email',
    });
  } catch (error) {
    //console.log(error);
    user.passwordResetToken = undefined;
    user.passwordresetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new appError('Error sending the email.Try again later', 500));
  }
});
exports.resetPassword = catchAsync(async (request, response, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(request.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordresetTokenExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new appError('Token is invalid or expired', 400));
  }

  user.password = request.body.password;
  user.passwordConfirm = request.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordresetTokenExpires = undefined;

  await user.save();
  createsendStatus(user, 200, response);
});
exports.updatePassword = catchAsync(async (request, response, next) => {
  const user = await User.findById(request.user.id).select('+password');
  if (
    !(await user.correctPassword(request.body.currentPassword, user.password))
  ) {
    return next(new appError('Your last password is not correct', 401));
  }

  user.password = request.body.password;
  user.passwordConfirm = request.body.passwordConfirm;
  await user.save();
  createsendStatus(user, 200, response);
  console.log(request.body.password);
});
