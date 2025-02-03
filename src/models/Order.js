const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number
        }
    ],
    totalPrice: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
