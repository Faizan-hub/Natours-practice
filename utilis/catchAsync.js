const { request } = require('../app');
const { response } = require('express');

module.exports = (funct) => {
  return (request, response, next) => {
    funct(request, response, next).catch(next);
  };
};
