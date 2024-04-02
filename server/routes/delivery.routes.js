const express = require('express');
const router = express.Router();
const Joi = require('joi');

const admin = require('server/middleware/admin');
const authorize = require('server/middleware/authorize');
const deliveryController = require('server/controller/delivery.controller');
const chairToOrderController = require('server/controller/chairToOrder.controller');
const deskToOrderController = require('server/controller/deskToOrder.controller');
const accessoryToOrderController = require('server/controller/accessoryToOrder.controller');
const validateRequest = require('server/middleware/validate-request');

router.get('/allChair', authorize(), deliveryController.getAllChairDelivery);
router.get('/chair', authorize(), deliveryController.getChairDelivery);
router.put('/chair', admin(), chairUpdateSchema, chairToOrderController.update);
router.get('/allDesk', authorize(), deliveryController.getAllDeskDelivery);
router.get('/desk', authorize(), deliveryController.getDeskDelivery);
router.put('/desk', admin(), deskUpdateSchema, deskToOrderController.update);
router.get('/accessory', authorize(), deliveryController.getAccessoryDelivery);
router.get('/allAccessory', authorize(), deliveryController.getAllAccessoryDelivery);
router.put('/accessory', admin(), accessoryUpdateSchema, accessoryToOrderController.update);
router.post(
  '/generatePDF',
  authorize(),
  generateSchema,
  deliveryController.generateDeliveryPDF
);
router.post('/sign', authorize(), signSchema, deliveryController.signDelivery);

function generateSchema(req, res, next) {
  const schema = Joi.object({
    productType: Joi.string().valid('chair', 'desk', 'accessory'),
    deliveryId: Joi.string().uuid().allow(null),
  });
  validateRequest(req, next, schema);
}

function chairUpdateSchema(req, res, next) {
  const schema = Joi.object({
    ids: Joi.array().required(),
    poNum: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function deskUpdateSchema(req, res, next) {
  const schema = Joi.object({
    ids: Joi.array().required(),
    akNum: Joi.string().required(),
    heworkNum: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function accessoryUpdateSchema(req, res, next) {
  const schema = Joi.object({
    ids: Joi.array().required(),
    poNum: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function signSchema(req, res, next) {
  const schema = Joi.object({
    productType: Joi.string().valid('chair', 'desk', 'accessory'),
    deliveryId: Joi.string().uuid().allow(null),
    signature: Joi.string().allow(''),
  });
  validateRequest(req, next, schema);
}

module.exports = router;
