const express = require('express');
const fs = require('fs');
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const request = require('request');
const config = require('./config');
let api = express.Router();

api.get('/status', (req, res, next) => {
  try {
    fs.readFile('./out.txt', 'utf8', async(err, data) => {
      if (err) {
        const errorObj = {
          msg: 'error',
          result: err,
        };

        res.end(JSON.stringify(errorObj));
      } else {
        const retObj = {
          msg: 'success',
          result: data.replace('\n', '<br/>'),
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

api.get('/update', (req, res, next) => {
  const options = {
    url: 'https://raw.githubusercontent.com/KomodoPlatform/Agama/dev/version_build',
    method: 'GET',
  };

  request(options, (error, response, body) => {
    if (response &&
        response.statusCode &&
        response.statusCode === 200) {
      const _html =
        `<html>
          <head>
            <title>Agama Linux Test Build ${body}</title>
          </head>
          <body>
            <a href="http://${config.ip}:${config.port}/public/Agama-linux-x64-v${body}.zip">Agama-linux-x64-v${body}.zip</a>
          </body>
        </html>`;

      fs.writeFile('./public/index.html', _html, (err) => {
        if (err) {
          shepherd.log('error index update');

          const retObj = {
            msg: 'error',
            result: 'error index update',
          };

          res.end(JSON.stringify(retObj));
        } else {
          const retObj = {
            msg: 'success',
            result: 'index updated',
          };

          res.end(JSON.stringify(retObj));
        }
      });
    }
  });
});

api.get('/trigger', (req, res, next) => {
  if (req.query.pass === config.pass) {
    const _html =
      `<html>
        <head>
          <title>Agama Linux Test Build ${body} in progress</title>
        </head>
        <body>Building...</body>
      </html>`;

    fs.writeFile('./public/index.html', _html, (err) => {
      if (err) {
        shepherd.log('error index update');
      }
    });

    const options = {
      url: 'https://raw.githubusercontent.com/KomodoPlatform/Agama/dev/version_build',
      method: 'GET',
    };

    request(options, (error, response, body) => {
      if (response &&
          response.statusCode &&
          response.statusCode === 200) {
        const retObj = {
          msg: 'success',
          result: 'build started',
        };

        res.end(JSON.stringify(retObj));

        console.log(`remote version ${body}`);

        fs.unlinkSync('out.txt');

        const spawnOut = fs.openSync('out.txt', 'a');
        const spawnErr = fs.openSync('out.txt', 'a');

        spawn('./build.sh', body, {
          stdio: [
            'ignore',
            spawnOut,
            spawnErr
          ],
          detached: true,
        }).unref();
      } else {
        const errorObj = {
          msg: 'error',
          result: 'unable to get remote version',
        };

        res.end(JSON.stringify(errorObj));
      }
    });
  } else {
    const errorObj = {
      msg: 'error',
      result: 'unauthorized access',
    };

    res.end(JSON.stringify(errorObj));
  }
});

module.exports = api;