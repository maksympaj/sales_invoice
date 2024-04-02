const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('server/middleware/validate-request');
const admin = require('server/middleware/admin');
const authorize = require('server/middleware/authorize');
const userController = require('server/controller/user.controller');

// routes
router.post('/login', authenticateSchema, authenticate);
router.post('/register', registerSchema, register);
router.get('/', admin(), getAll);
router.get('/current', authorize(), getCurrent);
router.get('/:id', admin(), getById);
router.put('/:id', admin(), updateSchema, update);
router.delete('/:id', admin(), _delete);
router.delete('/', admin(), bulkDeleteSchema, _bulkDelete);

module.exports = router;

function authenticateSchema(req, res, next) {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } })
      .messages({
        'any.required': `Email field is required.`,
        'string.empty': `Email cannot be empty.`,
        'string.email': `This Email address is not valid email type.`,
      }),
    password: Joi.string().required().messages({
      'any.required': `Password field is required.`,
      'string.empty': `Password cannot be empty.`,
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

function authenticate(req, res, next) {
  userController
    .authenticate(req.body)
    .then((user) => res.json(user))
    .catch(next);
}

function registerSchema(req, res, next) {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    prefix: Joi.string().max(2).allow(''),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    prefix: Joi.string().required(),
    type: Joi.string().valid('salesman', 'driver', ''),
    password: Joi.string().min(6).required(),
    avatarURL: Joi.string(),
  });
  validateRequest(req, next, schema);
}

function register(req, res, next) {
  userController
    .create(req.body)
    .then(() => {
      res.json({ message: 'Registration successful' });
    })
    .catch(next);
}

function getAll(req, res, next) {
  userController
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function getCurrent(req, res, next) {
  res.json(req.user);
}

function getById(req, res, next) {
  userController
    .getById(req.params.id)
    .then((user) => res.json(user))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().email().empty(''),
    firstName: Joi.string().empty(''),
    lastName: Joi.string().empty(''),
    username: Joi.string().empty(''),
    prefix: Joi.string().empty(''),
    type: Joi.string().empty(''),
    password: Joi.string().min(6).empty(''),
    isActive: Joi.boolean(),
  });
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  userController
    .update(req.params.id, req.body)
    .then((user) => res.json(user))
    .catch(next);
}

function _delete(req, res, next) {
  userController
    .delete(req.params.id)
    .then(() => res.json({ message: 'User deleted successfully' }))
    .catch(next);
}

function _bulkDelete(req, res, next) {
  userController
    .bulkDelete({ id: req.body.ids.map((tmp) => tmp.toString()) })
    .then((affectedRows) =>
      res.json({
        message: `${affectedRows} User${
          affectedRows === 1 ? ' was' : 's were'
        } deleted successfully.`,
      })
    )
    .catch(next);
}
