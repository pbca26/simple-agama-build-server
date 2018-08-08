const express = require('express');
const fs = require('fs');
const exec = require('child_process').exec;
const request = require('request');
let api = express.Router();

api.get('/status', (req, res, next) => {
  try {
    fs.readFile('out.txt', 'utf8', async(err, data) => {
      if (err) {
        const errorObj = {
          msg: 'error',
          result: err,
        };

        res.end(JSON.stringify(errorObj));
      } else {
        const retObj = {
          msg: 'success',
          result: data,
        };

        res.end(JSON.stringify(retObj));
      }
    });
  } catch (e) {
    const errorObj = {
      msg: 'error',
      result: 'unable to get status',
    };

    res.end(JSON.stringify(errorObj));
  }
});

api.get('/trigger', (req, res, next) => {
  const options = {
    url: 'https://raw.githubusercontent.com/KomodoPlatform/Agama/dev/version_build',
    method: 'GET',
  };

  request(options, (error, response, body) => {
    if (response &&
        response.statusCode &&
        response.statusCode === 200) {
      console.log(body);
      exec(`./build.sh ${body}`);
    }
  });
});

module.exports = api;