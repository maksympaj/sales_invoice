const express = require('express');
const router = express.Router();
const fs = require('fs');
const Joi = require('joi');

const validateRequest = require('server/middleware/validate-request');
const authorize = require('server/middleware/authorize');

module.exports = router;

function sendSchema(req, res, next) {
  const schema = Joi.object({
    phone: Joi.string().required(),
    message: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

router.get('/checkauth', async (req, res, next) => {
  client
    .getState()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err) {
        try {
          fs.unlinkSync('server/whatsapp/session.json');
        } catch {}
        next(err);
      }
    });
});

router.get('/getqr', authorize(), (req, res, next) => {
  fs.readFile('server/whatsapp/last.qr', (err, last_qr) => {
    fs.readFile('server/whatsapp/session.json', (serr, sessiondata) => {
      if (err && sessiondata) {
        next(new Error({ Authenticated: false }));
      } else if (!err && serr) {
        res.send({ qrcode: last_qr.toString() });
        res.end();
      } else {
        next(new Error({ Authenticated: false }));
      }
    });
  });
});

router.post('/send', authorize(), sendSchema, async (req, res, next) => {
  let phone = req.body.phone;
  let message = req.body.message;

  if (phone === undefined || phone === '')
    next(new Error('Phone Number is Required'));
  client
    .sendMessage(phone + '@c.us', message)
    .then((response) => {
      if (response.id.fromMe) {
        res.send({
          status: 'success',
          message: `Message successfully sent to ${phone}`,
        });
      }
    })
    .catch((err) => {
      next(err);
    });
});
