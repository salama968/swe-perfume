const VendorApplication = require('../models/VendorApplication');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const { computeParentStatus } = require('../services/orderStatus');

const applyForVendor = async (req, res, next) => {
  try {
    const { brandName, bio } = req.body;
    const existing = await VendorApplication.findOne({
      userId: req.user.id,
      status: 'pending',
    });

    if (existing) {
      return res.status(400).json({ error: 'Application already pending' });
    }

    const app = await VendorApplication.create({
      userId: req.user.id,
      brandName,
      bio,
    });

    return res.status(201).json(app);
  } catch (err) {
    return next(err);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const { items: bodyItems, shippingAddress } = req.body;
    const cart = await Cart.findOne({ userId: req.user.id });
    const sourceItems =
      Array.isArray(bodyItems) && bodyItems.length
        ? bodyItems
        : cart?.items || [];

    if (!sourceItems.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const productIds = sourceItems.map((item) => item.productId);
    const products = await Product.find({
      _id: { $in: productIds },
      isActive: true,
    });

    if (products.length !== new Set(productIds).size) {
      return res.status(400).json({ error: 'Invalid products in order' });
    }

    const productMap = new Map(
      products.map((product) => [product._id.toString(), product]),
    );

    const grouped = sourceItems.reduce((acc, item) => {
      const product = productMap.get(item.productId.toString());
      if (!product) return acc;
      const vendorKey = product.vendorId.toString();
      if (!acc[vendorKey]) acc[vendorKey] = [];
      acc[vendorKey].push({
        product,
        quantity: item.quantity,
      });
      return acc;
    }, {});

    const subOrders = Object.entries(grouped).map(([vendorId, entries]) => {
      const items = entries.map(({ product, quantity }) => ({
        productId: product._id,
        quantity,
        priceAtTime: product.price,
      }));
      const totalAmount = items.reduce(
        (sum, item) => sum + item.quantity * item.priceAtTime,
        0,
      );
      return {
        vendorId,
        items,
        totalAmount,
        status: 'pending',
      };
    });

    const totalAmount = subOrders.reduce(
      (sum, subOrder) => sum + subOrder.totalAmount,
      0,
    );

    const order = await Order.create({
      customerId: req.user.id,
      subOrders,
      totalAmount,
      shippingAddress,
      status: computeParentStatus(subOrders),
    });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    const responseOrder = order.toObject();
    responseOrder.items = subOrders.flatMap((sub) => sub.items);
    return res.status(201).json(responseOrder);
  } catch (err) {
    return next(err);
  }
};

const listMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customerId: req.user.id }).sort({
      placedAt: -1,
    });

    const normalized = orders.map((order) => {
      const mapped = order.toObject();
      mapped.items = (mapped.subOrders || []).flatMap((sub) => sub.items);
      return mapped;
    });

    return res.json({ data: normalized });
  } catch (err) {
    return next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(
      'email name role createdAt',
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ data: user });
  } catch (err) {
    return next(err);
  }
};

const deleteMe = async (req, res, next) => {
  try {
    const result = await User.deleteOne({ _id: req.user.id });
    if (!result.deletedCount) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ success: true });
  } catch (err) {
    return next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const isOwner = order.customerId.toString() === req.user.id;
    const isVendor = (order.subOrders || []).some(
      (sub) => sub.vendorId.toString() === req.user.id,
    );
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isVendor && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const responseOrder = order.toObject();
    responseOrder.items = (responseOrder.subOrders || []).flatMap(
      (sub) => sub.items,
    );
    return res.json({ data: responseOrder });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  applyForVendor,
  createOrder,
  listMyOrders,
  getProfile,
  deleteMe,
  getOrderById,
};
