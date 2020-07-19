const express = require('express');
const authContoller = require('./controller/autheController');
const viewController = require('./controller/viewsController');
const bookingController = require('./controller/bookingController');

const router = express.Router();
router.get(
  '/',
  bookingController.createBookingCheckout,
  authContoller.Loggedin,
  viewController.getOverview
);
router.get('/tour/:slug', authContoller.Loggedin, viewController.getTour);
router.get('/LogIn', authContoller.Loggedin, viewController.getLogin);
router.get('/me', authContoller.protect, viewController.getAccount);
router.get('/my-tours', authContoller.protect, viewController.getmyTours);
router.post(
  '/submit-user-data',
  authContoller.protect,
  viewController.updateUser
);
module.exports = router;
