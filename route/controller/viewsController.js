const Tour = require('../../models/tourModels');
const catchAsync = require('../../utilis/catchAsync');
const { request, response } = require('express');
const appError = require('../../utilis/appError');
const User = require('../../models/userModels');
const Booking = require('../../models/bookingModel');

exports.getOverview = catchAsync(async (request, response, next) => {
  const tours = await Tour.find();
  response.status(200).render('overview', { title: 'All Tours', tours });
});

exports.getTour = catchAsync(async (request, response, next) => {
  const tour = await Tour.findOne({ slug: request.params.slug }).populate({
    path: 'reviews',
    field: 'review rating user',
  });
  if (!tour) {
    return next(new appError('Oh! No tour with such name', 404));
  }
  response.status(200).render('tour', { title: `${tour.name} tour`, tour });
});

exports.getLogin = catchAsync(async (request, response, next) => {
  response.status(200).render('login', { title: 'Log in to your account' });
});

exports.getAccount = async (request, response) => {
  response.status(200).render('account', { title: 'Your account' });
};

exports.updateUser = catchAsync(async (request, response, next) => {
  const user = await User.findByIdAndUpdate(
    request.user.id,
    {
      name: request.body.name,
      email: request.body.email,
    },
    { new: true, runValidators: true }
  );
  response.status(200).render('account', { title: 'Your account', user: user });
});

exports.getmyTours = catchAsync(async (request, response, next) => {
  const bookings = await Booking.find({ user: request.user.id });

  const tourIds = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });
  response.status(200).render('overview', { title: 'My tours', tours });
});
