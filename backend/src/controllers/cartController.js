const Cart = require('../models/Cart');
const Product = require('../models/Product');

const buildCartResponse = async (cart) => {
  const items = cart?.items || [];
  const productIds = items.map((item) => item.productId);

  const products = await Product.find({
    _id: { $in: productIds },
    isActive: true,
  }).select('name price imageUrl vendorId');

  const productMap = new Map(
    products.map((product) => [product._id.toString(), product]),
  );

  const normalizedItems = items
    .map((item) => {
      const product = productMap.get(item.productId.toString());
      if (!product) return null;
      return {
        productId: item.productId,
        quantity: item.quantity,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        vendorId: product.vendorId,
      };
    })
    .filter(Boolean);

  const subtotal = normalizedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return {
    items: normalizedItems,
    subtotal,
  };
};

const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.json({ items: [], subtotal: 0 });
    }

    const response = await buildCartResponse(cart);
    return res.json(response);
  } catch (err) {
    return next(err);
  }
};

const ensureCart = async (userId) => {
  const existing = await Cart.findOne({ userId });
  if (existing) return existing;
  return Cart.create({ userId, items: [] });
};

const addCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) {
      return res.status(400).json({ error: 'Invalid product' });
    }

    const cart = await ensureCart(req.user.id);
    const existing = cart.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    const response = await buildCartResponse(cart);
    return res.json(response);
  } catch (err) {
    return next(err);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const cart = await ensureCart(req.user.id);
    const existing = cart.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (!existing) {
      return res.status(404).json({ error: 'Item not in cart' });
    }

    if (quantity < 1) {
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId,
      );
    } else {
      existing.quantity = quantity;
    }

    await cart.save();
    const response = await buildCartResponse(cart);
    return res.json(response);
  } catch (err) {
    return next(err);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await ensureCart(req.user.id);
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );
    await cart.save();
    const response = await buildCartResponse(cart);
    return res.json(response);
  } catch (err) {
    return next(err);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const cart = await ensureCart(req.user.id);
    cart.items = [];
    await cart.save();
    return res.json({ items: [], subtotal: 0 });
  } catch (err) {
    return next(err);
  }
};

const mergeCartItems = async (req, res, next) => {
  try {
    const { items } = req.body;
    const productIds = items.map((item) => item.productId);
    const products = await Product.find({
      _id: { $in: productIds },
      isActive: true,
    });

    if (products.length !== new Set(productIds).size) {
      return res.status(400).json({ error: 'Invalid products in cart' });
    }

    const cart = await ensureCart(req.user.id);
    items.forEach((item) => {
      const existing = cart.items.find(
        (entry) => entry.productId.toString() === item.productId,
      );
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        cart.items.push({
          productId: item.productId,
          quantity: item.quantity,
        });
      }
    });

    await cart.save();
    const response = await buildCartResponse(cart);
    return res.json(response);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeCartItems,
};
