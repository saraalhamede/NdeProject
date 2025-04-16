const { Schema, model } = require('mongoose');
const cartSchema = new Schema({
    userId: {
        type: String,
        required: true,
        minlength: 2,
    },
    products: [{ productId: String, quantity: Number }],
    active: {
        type: Boolean,
        required: true,
    },
});
const Cart = model("carts", cartSchema);
module.exports = Cart;