const express = require('express');
const router = express.Router();
const Joi = require('joi');

const admin = require('server/middleware/admin');
const salesman = require('server/middleware/salesman');
const authorize = require('server/middleware/authorize');
const validateRequest = require('server/middleware/validate-request');
const salesController = require('server/controller/sales.controller');

router.post('/create', authorize(), createSchema, salesController.create);
router.post(
  '/products',
  authorize(),
  productsSchema,
  salesController.updateProducts
);
router.get('/', admin(), getAll);
// router.get('/', getAll);
router.get('/current', salesman(), getCurrent);
router.get('/:id', getById);
router.put('/withoutStock/:id', salesman(), updateSchema, updateWithoutStock);
router.put('/:id', salesman(), createSchema, salesController.update);
router.post('/sign', authorize(), signSchema, signDelivery);
router.delete('/:id', salesman(), _delete);
router.delete('/', salesman(), bulkDeleteSchema, _bulkDelete);

module.exports = router;

function createSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().allow('').required(),
    email: Joi.string().allow('').required(),
    phone: Joi.string().allow('').required(),
    district: Joi.string().allow('').required(),
    street: Joi.string().allow('').required(),
    block: Joi.string().allow('').required(),
    floor: Joi.string().allow('').required(),
    unit: Joi.string().allow('').required(),
    remark: Joi.string().allow('').required(),
    timeLine: Joi.number().integer().min(0).required(),
    products: Joi.array().required(),
    paid: Joi.boolean().required(),
    paymentTerms: Joi.string().allow('').required(),
    dueDate: Joi.date().allow(null).required().messages({
      'any.required': `Due Date field is required.`,
      'date.base': `Due Date should be a valid date type.`,
    }),
    discount: Joi.number().min(0).required(),
    discountType: Joi.number().integer().min(0).required(),
    surcharge: Joi.number().min(0).required(),
    surchargeType: Joi.number().integer().min(0).required(),
  });
  validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    paid: Joi.boolean(),
    finished: Joi.boolean(),
  });
  validateRequest(req, next, schema);
}

function productsSchema(req, res, next) {
  const schema = Joi.object({
    chairToOrders: Joi.array(),
    deskToOrders: Joi.array(),
    accessoryToOrders: Joi.array(),
  });
  validateRequest(req, next, schema);
}

function bulkDeleteSchema(req, res, next) {
  const schema = Joi.object({
    ids: Joi.array().required(),
  });
  validateRequest(req, next, schema);
}

function signSchema(req, res, next) {
  const schema = Joi.object({
    orderId: Joi.string().guid().required(),
    signature: Joi.string()
      // .base64({ paddingRequired: false, urlSafe: true })
      .required(),
  });
  validateRequest(req, next, schema);
}

function getAll(req, res, next) {
  salesController
    .getAll()
    .then((salesOrders) =>
      res.json(
        salesOrders.map((item) => {
          item.invoiceNum = `I-${item.Seller.prefix}${new Date(
            item.createdAt
          ).getFullYear()}-${('000' + item.invoiceNum).substr(-3)}`;
          return item;
        })
      )
    )
    .catch(next);
}

function getCurrent(req, res, next) {
  salesController
    .getAll({ sellerId: req.user.id })
    .then((salesOrders) =>
      res.json(
        salesOrders.map((item) => {
          item.invoiceNum = `I-${item.Seller.prefix}${new Date(
            item.createdAt
          ).getFullYear()}-${('000' + item.invoiceNum).substr(-3)}`;
          return item;
        })
      )
    )
    .catch(next);
}

function getById(req, res, next) {
  salesController
    .getById(req.params.id)
    .then((salesOrder) => res.json(salesOrder))
    .catch(next);
}

function updateWithoutStock(req, res, next) {
  salesController
    .updateWithoutStock(req.params.id, req.body)
    .then((salesOrder) => res.json(salesOrder))
    .catch(next);
}

function signDelivery(req, res, next) {
  const host = req.get('host');
  const protocol = req.protocol;
  salesController
    .signDelivery(req.body.orderId, req.body.signature)
    .then((salesOrder) => {
      res.json({
        success: true,
        url: `${protocol}://${host}/${salesOrder.signURL}`,
      });
    })
    .catch(next);
}

function _delete(req, res, next) {
  salesController
    .delete(req.params.id)
    .then(() => res.json({ message: 'SalesOrder was deleted successfully.' }))
    .catch(next);
}

function _bulkDelete(req, res, next) {
  salesController
    .bulkDelete({ id: req.body.ids.map((tmp) => tmp.toString()) })
    .then((affectedRows) =>
      res.json({
        message: `${affectedRows} SalesOrder${
          affectedRows === 1 ? ' was' : 's were'
        } deleted successfully.`,
      })
    )
    .catch(next);
}
