const appError = require('../../utilis/appError');
const catchAsync = require('../../utilis/catchAsync');
const { request, response } = require('express');
const ApiFeatures = require('D:\\Semester_4\\complete-node-bootcamp-master\\4-natours\\starter\\utilis\\apiFeatures');

exports.deleteone = (Model) =>
  catchAsync(async (request, response, next) => {
    const doc = await Model.findByIdAndDelete(request.params.id);
    if (!doc) {
      return next(new appError('No tour with such Id', 404));
    }
    response.status(204).json({
      status: 'success',
      data: null,
    });
  });
exports.updateOne = (Model) =>
  catchAsync(async (request, response, next) => {
    const doc = await Model.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new appError('No document with such Id', 404));
    }
    response.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (request, response, next) => {
    const document = await Model.create(request.body);
    response.status(201).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.getOne = (Model, populatedOPtions) =>
  catchAsync(async (request, response, next) => {
    let query = Model.findById(request.params.id);
    if (populatedOPtions) {
      query = query.populate(populatedOPtions);
    }
    const doc = await query;
    if (!doc) {
      return next(new appError('No document with such Id', 404));
    }
    response.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });
exports.getALL = (Model) =>
  catchAsync(async (request, response, next) => {
    let filter = {};
    if (request.params.tourId) {
      filter = { tour: request.params.tourId };
    }
    const APIfeatures = new ApiFeatures(Model.find(filter), request.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    const docs = await APIfeatures.query;
    response.status(200).json({
      status: 'success',
      Request_Time: request.Time,
      data: {
        docs,
      },
    });
  });
