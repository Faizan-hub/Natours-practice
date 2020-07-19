const { request, response } = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const factory = require('D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/route/controller/factoryHandler');

const catchAsync = require('../../utilis/catchAsync');
const Tour = require('../../models/tourModels');
const Booking = require('../../models/bookingModel');

exports.checkOutSession = catchAsync(async (request, response, next) => {
  const tour = await Tour.findById(request.params.tourId);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${request.protocol}://${request.get('host')}/?tour=${
      request.params.tourId
    }&user=${request.user.id}&price=${tour.price}`,
    cancel_url: `${request.protocol}://${request.get('host')}/tour/${
      tour.slug
    }`,
    customer_email: request.user.email,
    client_reference_id: request.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.coverImage}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });
  response.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (request, response, next) => {
  const { tour, user, price } = request.query;
  if (!tour || !user || !price) {
    return next();
  }
  await Booking.create({ tour, user, price });
  response.redirect(request.originalUrl.split('?')[0]);
  next();
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getALL(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteone(Booking);
