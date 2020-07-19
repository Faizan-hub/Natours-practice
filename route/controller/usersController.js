const User = require('../../models/userModels');
const catchAsync = require('../../utilis/catchAsync');
const { syncIndexes } = require('../../models/userModels');
const { request, response } = require('express');
const factory = require('./factoryHandler');

const appError = require('../../utilis/appError');
const multer = require('multer');
const sharp = require('sharp');

const filterObject = (object, ...alllowedField) => {
  const newObj = {};
  Object.keys(object).forEach((el) => {
    if (alllowedField.includes(el)) {
      newObj[el] = object[el];
    }
  });
  return newObj;
};

exports.getCurrent = (request, response, next) => {
  request.params.id = request.user.id;
  next();
};

exports.deleteCurrent = catchAsync(async (request, response, next) => {
  const user = await User.findByIdAndUpdate(request.user.id, { active: false });
  response.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.deleteByadmin = factory.deleteone(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.getAllUsers = factory.getALL(User);

exports.updateCurrent = catchAsync(async (request, response, next) => {
  if (request.body.password || request.body.passwordConfirm) {
    return next(new appError('This route is not for that', 400));
  }
  const objects = filterObject(request.body, 'name', 'email');
  if (request.file) {
    objects.photo = request.file.filename;
  }
  const user = await User.findByIdAndUpdate(request.user.id, objects, {
    runValidators: true,
    new: true,
  });
  response.status(200).json({
    status: 'success',
    data: {
      user: user,
    },
  });
});

/*const multiStorage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, 'public/img/users');
  },
  filename: (request, file, callback) => {
    const extract = file.mimetype.split('/')[1];
    callback(null, `user-${request.user.id}-${Date.now()}.${extract}`);
  },
});*/
const multerStorage = multer.memoryStorage();
const fileFilter = (request, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(new appError('Not an image! Please upload an image,404'), false);
  }
};
exports.resizePhoto = catchAsync(async (request, response, next) => {
  if (!request.file) {
    return next();
  }
  request.file.filename = `user-${request.user.id}-${Date.now()}.jpeg`;
  await sharp(request.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${request.file.filename}`);
  next();
});
const upload = multer({ storage: multerStorage, fileFilter: fileFilter });

exports.uploadUserPhoto = upload.single('photo');
