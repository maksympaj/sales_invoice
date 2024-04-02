const express = require('express');
const router = express.Router();
const Joi = require('joi');

const admin = require('server/middleware/admin');
const authorize = require('server/middleware/authorize');
const validateRequest = require('server/middleware/validate-request');
const accessoryStockController = require('server/controller/accessoryStock.controller');
const uploadController = require('server/controller/upload.controller');

router.post('/create', admin(), createSchema, accessoryStockController.create);
router.post('/upload', admin(), uploadController.upload);
router.get('/', authorize(), getAll);
router.get('/features', authorize(), getFeatures);
router.get('/:id', authorize(), getById);
router.put('/:id', admin(), createSchema, update);
router.delete('/:id', admin(), _delete);
router.delete('/', admin(), bulkDeleteSchema, _bulkDelete);

module.exports = router;

function createSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().allow('').required(),
    category: Joi.string().allow('').required(),
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

function getAll(req, res, next) {
  accessoryStockController
    .getAll()
    .then((accessoryStocks) => res.json(accessoryStocks))
    .catch(next);
}

function getFeatures(req, res, next) {
  accessoryStockController
    .getFeatures()
    .then((accessoryStocks) => res.json(accessoryStocks))
    .catch(next);
}

function getById(req, res, next) {
  accessoryStockController
    .getById(req.params.id)
    .then((accessoryStock) => res.json(accessoryStock))
    .catch(next);
}

function update(req, res, next) {
  accessoryStockController
    .update(req.params.id, req.body)
    .then((accessoryStock) => res.json(accessoryStock))
    .catch(next);
}

function _delete(req, res, next) {
  accessoryStockController
    .delete(req.params.id)
    .then(() =>
      res.json({ message: 'AccessoryStock was deleted successfully.' })
    )
    .catch(next);
}

function _bulkDelete(req, res, next) {
  accessoryStockController
    .bulkDelete({ id: req.body.ids.map((tmp) => tmp.toString()) })
    .then((affectedRows) =>
      res.json({
        message: `${affectedRows} AccessoryStock${
          affectedRows === 1 ? ' was' : 's were'
        } deleted successfully.`,
      })
    )
    .catch(next);
}
