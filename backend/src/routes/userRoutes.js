const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const {
  applyForVendor,
  createOrder,
  listMyOrders,
  getProfile,
  deleteMe,
  getOrderById,
} = require('../controllers/userController');

const router = express.Router();

const objectId = Joi.string().hex().length(24);

router.post(
  '/users/vendor-apply',
  requireAuth,
  requireRole('user', 'vendor', 'admin'),
  celebrate({
    [Segments.BODY]: Joi.object({
      brandName: Joi.string().min(2).required(),
      bio: Joi.string().allow('').optional(),
    }),
  }),
  applyForVendor,
);

router.get(
  '/users/me',
  requireAuth,
  requireRole('user', 'vendor', 'admin'),
  getProfile,
);

router.delete(
  '/users/me',
  requireAuth,
  requireRole('user', 'vendor', 'admin'),
  deleteMe,
);

router.post(
  '/orders',
  requireAuth,
  requireRole('user', 'vendor', 'admin'),
  celebrate({
    [Segments.BODY]: Joi.object({
      items: Joi.array()
        .items(
          Joi.object({
            productId: objectId.required(),
            quantity: Joi.number().integer().min(1).required(),
          }),
        )
        .min(1)
        .optional(),
      shippingAddress: Joi.object({
        street: Joi.string().allow('').optional(),
        city: Joi.string().allow('').optional(),
        zip: Joi.string().allow('').optional(),
        country: Joi.string().allow('').optional(),
      }).required(),
    }),
  }),
  createOrder,
);

router.get(
  '/orders/my-orders',
  requireAuth,
  requireRole('user', 'vendor', 'admin'),
  listMyOrders,
);

router.get(
  '/orders/:id',
  requireAuth,
  requireRole('user', 'vendor', 'admin'),
  celebrate({
    [Segments.PARAMS]: Joi.object({ id: objectId.required() }),
  }),
  getOrderById,
);

module.exports = router;
