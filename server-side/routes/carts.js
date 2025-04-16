const express = require("express");
const Cart = require("../models/Cart");
const Procduct = require("../models/Product");
const auth = require("../middlewares/auth");
const router = express.Router();
router.patch("/", auth, async (req, res) => {
    try {

        let product = await Procduct.findById(req.body.productId);
        if (!product) return res.status(404).send("No such product");


        if (!product.quantity) return res.status(400).send("Product out of stock");


        let cart = await Cart.findOne({ userId: req.payload._id, active: true });
        if (!cart) return res.status(404).send("No such cart");


        let indexToAdd = cart.products.findIndex(
            (p) => p.productId === req.body.productId
        );
        if (indexToAdd != -1) {
            cart.products[indexToAdd].quantity++;
            cart.markModified("products");
        } else {
            cart.products.push({ productId: req.body.productId, quantity: 1 });
        }
        await cart.save();
        product.quantity--;
        if (!product.quantity) product.available = false;
        await product.save();
        res.status(200).send("Product has been added to cart");
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/", auth, async (req, res) => {
    try {

        const cart = await Cart.findOne({ userId: req.payload._id, active: true });
        if (!cart) return res.status(404).send("No such cart");


        let promises = cart.products.map((p) => Procduct.findById(p.productId));


        let result = await Promise.all(promises);
        if (!result) return res.status(400).send("Error in products");

        let cartItems = [];
        for (let i in result) {
            if (result[i])
                cartItems.push({
                    ...result[i].toObject(),
                    ...cart.products[i].toObject(),
                });
        }
        res.status(200).send(cartItems);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;