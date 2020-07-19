const Review = require('D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/models/reviewModel');

const catchAsync = require('D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/utilis/catchAsync');
const factory = require('D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/route/controller/factoryHandler');

const { request } = require('../../app');
const { response } = require('express');
const User = require('../../models/userModels');

exports.setUserTourid = (request, response, next) => {
  if (!request.body.tour) {
    request.body.tour = request.params.tourId;
  }
  if (!request.body.user) {
    request.body.user = request.user.id;
  }
  next();
};
exports.getAllReviews = factory.getALL(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteone(Review);
exports.updateReview = factory.updateOne(Review);
