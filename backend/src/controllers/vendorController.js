const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { uploadImageBuffer } = require('../services/cloudinary');
const { computeParentStatus } = require('../services/orderStatus');

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, imageUrl: imageUrlInput } = req.body;
    let imageUrl = '';

    if (imageUrlInput && req.file) {
      return res
        .status(400)
        .json({ error: 'Provide either imageUrl or image file, not both' });
    }

    if (imageUrlInput) {
      imageUrl = imageUrlInput;
    } else if (req.file) {
      imageUrl = await uploadImageBuffer(
        req.file.buffer,
        req.file.originalname,
      );
    }

    const product = await Product.create({
      vendorId: req.user.id,
      name,
      description,
      price,
      imageUrl,
    });

    return res.status(201).json(product);
  } catch (err) {
    return next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role !== 'admin') {
      filter.vendorId = req.user.id;
    }

    const product = await Product.findOne(filter);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const {
      name,
      description,
      price,
      isActive,
      imageUrl: imageUrlInput,
    } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (isActive !== undefined) product.isActive = isActive;

    if (imageUrlInput && req.file) {
      return res
        .status(400)
        .json({ error: 'Provide either imageUrl or image file, not both' });
    }

    if (imageUrlInput) {
      product.imageUrl = imageUrlInput;
    } else if (req.file) {
      product.imageUrl = await uploadImageBuffer(
        req.file.buffer,
        req.file.originalname,
      );
    }

    await product.save();
    return res.json(product);
  } catch (err) {
    return next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role !== 'admin') {
      filter.vendorId = req.user.id;
    }

    const product = await Product.findOne(filter);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.isActive = false;
    await product.save();

    return res.json({ success: true });
  } catch (err) {
    return next(err);
  }
};

const listVendorOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      'subOrders.vendorId': req.user.id,
    }).sort({
      placedAt: -1,
    });

    const customerIds = orders.map((order) => order.customerId.toString());
    const customers = await User.find({ _id: { $in: customerIds } }).select(
      'name',
    );
    const customerMap = new Map(
      customers.map((customer) => [customer._id.toString(), customer.name]),
    );

    const vendorOrders = orders.flatMap((order) => {
      const subOrders = (order.subOrders || []).filter(
        (sub) => sub.vendorId.toString() === req.user.id,
      );
      return subOrders.map((sub) => ({
        _id: sub._id,
        parentOrderId: order._id,
        customerId: order.customerId,
        customerName:
          customerMap.get(order.customerId.toString()) || 'Customer',
        status: sub.status,
        items: sub.items,
        totalAmount: sub.totalAmount,
        placedAt: order.placedAt,
      }));
    });

    return res.json({ data: vendorOrders });
  } catch (err) {
    return next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      'subOrders._id': req.params.id,
      'subOrders.vendorId': req.user.id,
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const subOrder = order.subOrders.find(
      (sub) => sub._id.toString() === req.params.id,
    );
    if (!subOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    subOrder.status = req.body.status;
    order.status = computeParentStatus(order.subOrders);
    await order.save();

    return res.json({
      _id: subOrder._id,
      parentOrderId: order._id,
      status: subOrder.status,
    });
  } catch (err) {
    return next(err);
  }
};

const createProductsBulk = async (req, res, next) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Products array is required' });
    }

    if (products.length > 100) {
      return res.status(400).json({ error: 'Max 100 products per request' });
    }

    const docs = products.map((item) => ({
      vendorId: req.user.id,
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl || '',
    }));

    const created = await Product.insertMany(docs, { ordered: false });

    return res.status(201).json({
      count: created.length,
      data: created,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  listVendorOrders,
  updateOrderStatus,
  createProductsBulk,
};
