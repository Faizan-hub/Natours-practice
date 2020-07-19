const express = require('express');

const reviewController = require('D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/route/controller/reviewController');

const authController = require('D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/route/controller/autheController');

const router = express.Router({ mergeParams: true });
router.use(authController.protect);
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setUserTourid,
    reviewController.createReview
  );
router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );
module.exports = router;
