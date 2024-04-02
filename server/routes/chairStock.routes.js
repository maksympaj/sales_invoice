const express = require("express");
const router = express.Router();
const Joi = require("joi");

const admin = require("server/middleware/admin");
const authorize = require("server/middleware/authorize");
const validateRequest = require("server/middleware/validate-request");
const chairStockController = require("server/controller/chairStock.controller");
const uploadController = require("server/controller/upload.controller");

router.post("/create", admin(), createSchema, chairStockController.create);
router.post("/upload", admin(), uploadController.upload);
router.post("/uploadCreate", admin(), uploadController.uploadCreate);
router.get("/", authorize(), getAll);
router.get("/features", authorize(), getFeatures);
router.get("/:id", authorize(), getById);
router.put("/:id", admin(), createSchema, update);
router.delete("/:id", admin(), _delete);
router.delete("/", admin(), bulkDeleteSchema, _bulkDelete);

module.exports = router;

function createSchema(req, res, next) {
  const schema = Joi.object({
    brand: Joi.string().allow("").required(),
    model: Joi.string().allow("").required(),
    frameColor: Joi.string().allow("").required(),
    backColor: Joi.string().allow("").required(),
    seatColor: Joi.string().allow("").required(),
    backMaterial: Joi.string().allow("").required(),
    seatMaterial: Joi.string().allow("").required(),
    withHeadrest: Joi.boolean().required(),
    withAdArmrest: Joi.boolean().required(),
    remark: Joi.string().allow("").required(),
    thumbnailURL: Joi.string().empty(""),
    unitPrice: Joi.number().min(0).required(),
    balance: Joi.number().integer().min(0).required(),
    qty: Joi.number().integer().min(0).required(),
    shipmentDate: Joi.date().allow(null).required().messages({
      "any.required": `Shipment Date field is required.`,
      "date.base": `Shipment Date should be a valid date type.`,
    }),
    arrivalDate: Joi.date().allow(null).required().messages({
      "any.required": `Arrival Date field is required.`,
      "date.base": `Arrival Date should be a valid date type.`,
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
  chairStockController
    .getAll()
    .then((chairStocks) => res.json(chairStocks))
    .catch(next);
}

function getFeatures(req, res, next) {
  chairStockController
    .getFeatures()
    .then((chairStocks) => res.json(chairStocks))
    .catch(next);
}

function getById(req, res, next) {
  chairStockController
    .getById(req.params.id)
    .then((chairStock) => res.json(chairStock))
    .catch(next);
}

function update(req, res, next) {
  chairStockController
    .update(req.params.id, req.body)
    .then((chairStock) => res.json(chairStock))
    .catch(next);
}

function _delete(req, res, next) {
  chairStockController
    .delete(req.params.id)
    .then(() => res.json({ message: "ChairStock was deleted successfully." }))
    .catch(next);
}

function _bulkDelete(req, res, next) {
  chairStockController
    .bulkDelete({ id: req.body.ids.map((tmp) => tmp.toString()) })
    .then((affectedRows) =>
      res.json({
        message: `${affectedRows} ChairStock${
          affectedRows === 1 ? " was" : "s were"
        } deleted successfully.`,
      })
    )
    .catch(next);
}
