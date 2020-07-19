const express = require('express');
const authContoller = require('D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/route/controller/autheController');
const viewController = require('D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/route/controller/viewsController');
const bookingController = require('D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/route/controller/bookingController');

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
