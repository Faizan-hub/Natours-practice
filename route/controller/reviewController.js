const Review = require('../../models/reviewModel');

const catchAsync = require('../../utilis/catchAsync');
const factory = require('./factoryHandler');

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
