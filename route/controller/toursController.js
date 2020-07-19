const Tour = require('D:\\Semester_4\\complete-node-bootcamp-master\\4-natours\\starter\\models\\tourModels');
const { request, response } = require('express');
const catchAsync = require('D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/utilis/catchAsync');
const ApiFeatures = require('D:\\Semester_4\\complete-node-bootcamp-master\\4-natours\\starter\\utilis\\apiFeatures');
const appError = require('../../utilis/appError');
const factory = require('D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/route/controller/factoryHandler');
const multer = require('multer');
const sharp = require('sharp');
exports.aliasTopCheap = (request, response, next) => {
  request.query.limit = '4';
  request.query.sort = '-ratingsAverage,price';
  request.query.fields = 'name,ratingsAverage,difficulty,price,summary';
  next();
};

exports.getAllTours = factory.getALL(Tour);
exports.createTour = factory.createOne(Tour);

exports.getTour = factory.getOne(Tour, { path: 'reviews' });

exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteone(Tour);

exports.getStats = catchAsync(async (request, response, next) => {
  const stats = await Tour.aggregate()
    .match({ ratingsAverage: { $gt: 0 } })
    .group({
      _id: { $toUpper: '$difficulty' },
      numTours: { $sum: 1 },
      numRatings: { $sum: '$ratingsQuantity' },
      avgRatings: { $avg: '$ratingsAverage' },
      avgPrice: { $avg: '$price' },
      minPrice: { $min: '$price' },
      maxPrice: { $max: '$price' },
    })
    .sort({ avgPrice: 1 });
  //can hav more than 1 matches
  response.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPan = catchAsync(async (request, response, next) => {
  const year = request.params.year * 1;
  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numOfTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    { $addFields: { month: '$_id' } },
    { $project: { _id: 0 } },
    { $sort: { numOfTours: -1 } },
    { $limit: 12 },
  ]);
  response.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

exports.getToursWithin = catchAsync(async (request, response, next) => {
  const { distance, lating, unit } = request.params;
  const [lati, long] = lating.split(',');
  let radius = unit;
  if (unit === 'mi') {
    radius = distance / 3962.2;
  } else {
    radius = distance / 6378.1;
  }
  if (!lati || !long) {
    return next(new appError('Please provide longitiude and latitude', 404));
  }
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[long, lati], radius] } },
  });
  response.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      data: tours,
    },
  });
});
exports.distances = catchAsync(async (request, response, next) => {
  const { lating, unit } = request.params;
  const [lati, long] = lating.split(',');
  if (!lati || !long) {
    return next(new appError('Please provide longitiude and latitude', 404));
  }
  let multiplier = 1;
  console.log(unit);
  if (unit === 'mi') {
    multiplier = 0.000621371;
  } else {
    multiplier = 0.001;
  }
  console.log(multiplier);
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [long * 1, lati * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
  response.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});
const multerStorage = multer.memoryStorage();
const fileFilter = (request, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(new appError('Not an image! Please upload an image,404'), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: fileFilter });

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeTourImages = catchAsync(async (request, response, next) => {
  if (!request.files.imageCover || !request.files.images) {
    return next();
  }
  const imageCovername = `user-${request.user.id}-${Date.now()}-cover.jpeg`;
  await sharp(request.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${imageCovername}`);
  request.body.imageCover = imageCovername;
  request.body.images = [];
  await Promise.all(
    request.files.images.map(async (file, i) => {
      const filename = `user-${request.user.id}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);
      request.body.images.push(filename);
    })
  );
  next();
});
