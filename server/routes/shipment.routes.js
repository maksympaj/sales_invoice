const express = require("express");
const router = express.Router();
const Joi = require("joi");

const admin = require("server/middleware/admin");
const salesman = require("server/middleware/salesman");
const authorize = require("server/middleware/authorize");
const validateRequest = require("server/middleware/validate-request");
const shipmentController = require("server/controller/shipment.controller");

router.get("/", admin(), getAll);
router.post("/create", authorize(), createSchema, shipmentController.create);
router.get("/products", shipmentController.getProducts);
router.get("/:id", getById);
router.put("/:id", authorize(), shipmentController.update);
router.delete("/:id", admin(), _delete);

module.exports = router;

function createSchema(req, res, next) {
  const schema = Joi.object({
    supplier: Joi.string().allow("").required(),
    location: Joi.string().allow("").required(),
    remark: Joi.string().allow("").required(),
    products: Joi.array().required(),
  });
  validateRequest(req, next, schema);
}

function getAll(req, res, next) {
  shipmentController
    .getAll()
    .then((shipments) => res.json(shipments))
    .catch(next);
}

function getById(req, res, next) {
  shipmentController
    .getById(req.params.id)
    .then((shipment) => res.json(shipment))
    .catch(next);
}

function _delete(req, res, next) {
  shipmentController
    .delete(req.params.id)
    .then(() => res.json({ message: "Shipment was deleted successfully." }))
    .catch(next);
}
