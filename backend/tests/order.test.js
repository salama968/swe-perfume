const request = require('supertest');
const app = require('../src/app');
const Product = require('../src/models/Product');
const { createUser, signToken } = require('./helpers');

describe('Orders', () => {
  it('calculates totals from DB prices', async () => {
    const vendor = await createUser({
      role: 'vendor',
      email: 'vendor@test.local',
    });
    const customer = await createUser({
      role: 'user',
      email: 'customer@test.local',
    });

    const product = await Product.create({
      vendorId: vendor._id,
      name: 'Item',
      description: 'Item description',
      price: 15,
      isActive: true,
    });

    const token = signToken(customer);

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [{ productId: product._id.toString(), quantity: 2 }],
        shippingAddress: {
          street: '123 Lane',
          city: 'Town',
          zip: '00000',
          country: 'US',
        },
      });

    expect(res.status).toBe(201);
    expect(res.body.totalAmount).toBe(30);
    expect(res.body.subOrders).toHaveLength(1);
    expect(res.body.subOrders[0].vendorId).toBe(vendor._id.toString());
    expect(res.body.subOrders[0].totalAmount).toBe(30);
  });
});
