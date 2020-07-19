const express = require('express');

const toursController = require('D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/route/controller/toursController');
const authController = require('D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/route/controller/autheController');
const reviewController = require('D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/route/controller/reviewController');
const reviewRouter = require('D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/route/reviewRoute');
const router = express.Router();

//router.param('id', toursController.checkId);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    toursController.getMonthlyPan
  );
router.route('/get-stats').get(toursController.getStats);
router
  .route('/top-4-cheap')
  .get(toursController.aliasTopCheap, toursController.getAllTours);
router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    toursController.createTour
  )
  .get(toursController.getAllTours);

router
  .route('/tours-within/:distance/centre/:lating/unit/:unit')
  .get(toursController.getToursWithin);

router.route('/distances/:lating/unit/:unit').get(toursController.distances);
router
  .route('/:id')
  .get(toursController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    toursController.uploadTourImages,
    toursController.resizeTourImages,
    toursController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    toursController.deleteTour
  );
router.use('/:tourId/reviews', reviewRouter);
/*router
  .route('/:tourId/reviews')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );*/
module.exports = router;
