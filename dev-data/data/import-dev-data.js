const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModels');
const User = require('../../models/userModels');
const Review = require('../../models/reviewModel');
const fs = require('fs');
dotenv.config({
  path:
    'D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/config.env',
});
const tours = JSON.parse(
  fs.readFileSync(
    'D:\\Semester_4\\complete-node-bootcamp-master\\4-natours\\starter\\dev-data\\data\\tours.json',
    'utf-8'
  )
);
const users = JSON.parse(
  fs.readFileSync(
    'D:\\Semester_4\\complete-node-bootcamp-master\\4-natours\\starter\\dev-data\\data\\users.json',
    'utf-8'
  )
);
const reviews = JSON.parse(
  fs.readFileSync(
    'D:\\Semester_4\\complete-node-bootcamp-master\\4-natours\\starter\\dev-data\\data\\reviews.json',
    'utf-8'
  )
);
mongoose
  .connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB Connected!'))
  .catch((err) => {
    console.log(`DB Connection Error: ${err.message}`);
  });
const impportData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Successfully Added in Database!');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Successfully deleted Database!');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '--import') {
  impportData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
