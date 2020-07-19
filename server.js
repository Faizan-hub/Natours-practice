const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({
  path:
    'D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/config.env',
});
process.on('uncaughtException', (error) => {
  console.log(error.name, error.message);
  process.exit(1);
});
const app = require('D:/Semester_4/complete-node-bootcamp-master/4-natours/starter/app');

mongoose
  .connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB Connected!'));

//console.log(process.env.NODE_ENV);
//console.log(process.env);

const port = 7676 || process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
//Test
process.on('unhandledRejection', (error) => {
  //console.log(error.name, error.message);
  console.log('UnHandled Rejection!');
  server.close(() => {
    process.exit(1);
  });
});
