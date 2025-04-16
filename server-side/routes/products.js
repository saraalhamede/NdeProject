const express = require("express");
const auth = require("../middlewares/auth");
const Joi = require("joi");
const Product = require("../models/Product");
const router = express.Router();


const productsSchema = Joi.object({
    _id: Joi.string(),
    name: Joi.string().required().min(2),
    price: Joi.number().required(),
    category: Joi.string().required().min(2),
    description: Joi.string().required().min(2),
    image: Joi.string().uri(),
    available: Joi.boolean(),
    quantity: Joi.number(),
    __v: Joi.number(),
});


router.post("/", auth, async (req, res) => {
    try {

        if (!req.payload.isAdmin) return res.status(401).send("Access denied");

        const { error } = productsSchema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);


        let product = await Product.findOne({ name: req.body.name });
        if (product) return res.status(400).send("Product already exists");


        product = new Product(req.body);
        await product.save();
        res.status(201).send("Product has been added successfully :)");
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/", auth, async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).send(products);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/:productId", auth, async (req, res) => {
    try {

        const product = await Product.findById(req.params.productId);
        if (!product) return res.status(400).send("No such product");
        res.status(200).send(product);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.put("/:productId", auth, async (req, res) => {
    try {

        if (!req.payload.isAdmin) return res.status(400).send("Access denied");


        const { error } = productsSchema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);


        const product = await Product.findByIdAndUpdate(
            req.params.productId,
            req.body
        );
        if (!product) return res.status(404).send("No such product");
        res.status(200).send("Product update successfully");
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete("/:productId", auth, async (req, res) => {
    try {

        if (!req.payload.isAdmin) return res.status(400).send("Access denied");
        const product = await Product.findByIdAndDelete(req.params.productId);
        if (!product) return res.status(404).send("No such product");
        res.status(200).send("Product has been deleted successfully!");
    } catch (error) {
        res.status(400).send(error);
    }
});

router.patch("/:productId", auth, async (req, res) => {
    try {

        if (!req.payload.isAdmin) return res.status(400).send("Access denied");
        const product = await Product.findByIdAndUpdate(
            req.params.productId,
            req.body
        );
        if (!product) return res.status(404).send("No such product");
        res.status(200).send("Product has been updated successfully!");
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;