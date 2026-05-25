const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeCartItems,
} = require('../controllers/cartController');

const router = express.Router();
const objectId = Joi.string().hex().length(24);

router.get('/', requireAuth, requireRole('user', 'vendor', 'admin'), getCart);

router.post(
  '/items',
  requireAuth,
  requireRole('user', 'vendor', 'admin'),
  celebrate({
    [Segments.BODY]: Joi.object({
      productId: objectId.required(),
      quantity: Joi.number().integer().min(1).required(),
    }),
  }),
  addCartItem,
);

router.put(
  '/items/:productId',
  requireAuth,
  requireRole('user', 'vendor', 'admin'),
  celebrate({
    [Segments.PARAMS]: Joi.object({ productId: objectId.required() }),
    [Segments.BODY]: Joi.object({
      quantity: Joi.number().integer().min(0).required(),
    }),
  }),
  updateCartItem,
);

router.delete(
  '/items/:productId',
  requireAuth,
  requireRole('user', 'vendor', 'admin'),
  celebrate({
    [Segments.PARAMS]: Joi.object({ productId: objectId.required() }),
  }),
  removeCartItem,
);

router.delete(
  '/',
  requireAuth,
  requireRole('user', 'vendor', 'admin'),
  clearCart,
);

router.post(
  '/merge',
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
        .required(),
    }),
  }),
  mergeCartItems,
);

module.exports = router;
