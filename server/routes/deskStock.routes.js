const express = require('express');
const router = express.Router();
const Joi = require('joi');

const admin = require('server/middleware/admin');
const authorize = require('server/middleware/authorize');
const validateRequest = require('server/middleware/validate-request');
const deskStockController = require('server/controller/deskStock.controller');
const uploadController = require('server/controller/upload.controller');

router.post('/create', admin(), createSchema, create);
router.post('/upload', admin(), uploadController.upload);
router.get('/', authorize(), getAll);
router.get('/get_order_joined', authorize(), getOrderJoinedAll);
router.get('/features', authorize(), deskStockController.getFeatures);
router.get('/:id', authorize(), getById);
router.put('/:id', admin(), createSchema, update);
router.delete('/:id', admin(), _delete);
router.delete('/', admin(), bulkDeleteSchema, _bulkDelete);

module.exports = router;

function createSchema(req, res, next) {
  const schema = Joi.object({
    supplierCode: Joi.string().allow('').required(),
    model: Joi.string().allow('').required(),
    color: Joi.string().allow('').required(),
    armSize: Joi.string().allow('').required(),
    feetSize: Joi.string().allow('').required(),
    beamSize: Joi.string().allow('').required(),
    remark: Joi.string().allow('').required(),
    thumbnailURL: Joi.string().empty(''),
    unitPrice: Joi.number().min(0).required(),
    balance: Joi.number().integer().min(0).required(),
    qty: Joi.number().integer().min(0).required(),
    shipmentDate: Joi.date().allow(null).required().messages({
      'any.required': `Shipment Date field is required.`,
      'date.base': `Shipment Date should be a valid date type.`,
    }),
    arrivalDate: Joi.date().allow(null).required().messages({
      'any.required': `Arrival Date field is required.`,
      'date.base': `Arrival Date should be a valid date type.`,
    }),
  });
  validateRequest(req, next, schema);
}

function bulkDeleteSchema(req, res, next) {
  const schema = Joi.object({
    ids: Joi.array().required(),
  });
  validateRequest(req, next, schema);
}

function create(req, res, next) {
  deskStockController
    .create(req.body)
    .then(() => {
      res.json({ message: 'New DeskStock was created successfully.' });
    })
    .catch(next);
}

function getAll(req, res, next) {
  deskStockController
    .getAll()
    .then((deskStocks) => res.json(deskStocks))
    .catch(next);
}

function getOrderJoinedAll(req, res, next) {
  deskStockController
    .getOrderJoinedAll()
    .then((deskStocks) => res.json(deskStocks))
    .catch(next);
}

function getById(req, res, next) {
  deskStockController
    .getById(req.params.id)
    .then((deskStock) => res.json(deskStock))
    .catch(next);
}

function update(req, res, next) {
  deskStockController
    .update(req.params.id, req.body)
    .then((deskStock) => res.json(deskStock))
    .catch(next);
}

function _delete(req, res, next) {
  deskStockController
    .delete(req.params.id)
    .then(() => res.json({ message: 'DeskStock was deleted successfully.' }))
    .catch(next);
}

function _bulkDelete(req, res, next) {
  deskStockController
    .bulkDelete({ id: req.body.ids.map((tmp) => tmp.toString()) })
    .then((affectedRows) =>
      res.json({
        message: `${affectedRows} DeskStock${
          affectedRows === 1 ? ' was' : 's were'
        } deleted successfully.`,
      })
    )
    .catch(next);
}
