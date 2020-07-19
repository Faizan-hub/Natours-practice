const express = require('express');
const userController = require('./controller/usersController');
const authController = require('./controller/autheController');
const router = express.Router();
router.post('/signUp', authController.signUp);
router.post('/logIn', authController.logIn);
router.get('/logOut', authController.logOut);
router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.use(authController.protect);
router.get('/getCurrent', userController.getCurrent, userController.getUser);
router.patch('/updatePassword', authController.updatePassword);
router.patch(
  '/updateCurrent',
  userController.uploadUserPhoto,
  userController.resizePhoto,
  userController.updateCurrent
);
router.delete('/deleteCurrent', userController.deleteCurrent);
router.use(authController.restrictTo('admin'));
router.route('/').get(userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteByadmin);
module.exports = router;
