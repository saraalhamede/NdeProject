const { Schema, model } = require('mongoose');
const productSchema = new Schema({
    name: {
        type: string,
        required: true,
        minlength: 2,
    },
    price: {
        type: number,
        required: true,
    },
    category: {
        type: string,
        required: true,
        minlength: 2,
    },
    image: {
        type: string,
        default: "https://www.pngall.com/wp-content/uploads/5/No-Image-Placeholder-PNG.png",
    },
    available: {
        type: boolean,
        default: true,
    },
    quantity: {
        type: number,
        default: 5,
    },
});
const Product = model("products", productSchema);
module.exports = Product;