const express = require('express');

const authController = require('./controller/autheController');
const bookingController = require('./controller/bookingController');
const { route } = require('../app');

const router = express.Router();
router.use(authController.protect);
router.get('/check-out-session/:tourId', bookingController.checkOutSession);
router.use(authController.restrictTo('admin', 'lead-guide'));
router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);
router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);
module.exports = router;
