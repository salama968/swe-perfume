const STATUS_PRIORITY = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
};

const computeParentStatus = (subOrders) => {
  if (!Array.isArray(subOrders) || subOrders.length === 0) {
    return 'pending';
  }

  const highest = subOrders.reduce((acc, sub) => {
    const value = STATUS_PRIORITY[sub.status] ?? 0;
    return value > acc ? value : acc;
  }, 0);

  const allDelivered = subOrders.every((sub) => sub.status === 'delivered');
  if (allDelivered) return 'delivered';

  if (highest >= STATUS_PRIORITY.shipped) return 'shipped';
  if (highest >= STATUS_PRIORITY.processing) return 'processing';
  return 'pending';
};

module.exports = { computeParentStatus };
