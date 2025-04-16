const express = require("express");
const Joi = require("joi");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Cart = require("../models/Cart");
const auth = require("../middlewares/auth");
const _ = require("lodash");
const router = express.Router();

const registerSchema = Joi.object({
    name: Joi.string().required().min(2),
    email: Joi.string().required().email().min(2),
    password: Joi.string().required().min(8),
    isAdmin: Joi.boolean().required(),
});


router.post("/", async (req, res) => {
    try {

        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);


        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send("User already exists");


        user = new User(req.body);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();


        const cart = new Cart({ userId: user._id, products: [], active: true });
        await cart.save();


        const token = jwt.sign(
            { _id: user._id, isAdmin: user.isAdmin },
            process.env.JWTKEY
        );
        res.status(201).send(token);
    } catch (error) {
        res.status(400).send(error);
    }
});

const loginSchema = Joi.object({
    email: Joi.string().required().email().min(2),
    password: Joi.string().required().min(8),
});


router.post("/login", async (req, res) => {
    try {

        const { error } = loginSchema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);


        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("Email or password are incorrect");


        const result = await bcrypt.compare(req.body.password, user.password);
        if (!result) return res.status(400).send("Email or password are incorrect");

        const token = jwt.sign(
            { _id: user._id, isAdmin: user.isAdmin },
            process.env.JWTKEY
        );
        res.status(200).send(token);
    } catch (error) {
        res.status(400).send(error);
    }
});
router.get("/users", auth, async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.status(200).send(users);
    } catch (error) {
        res.status(400).send(error);
    }
});
router.get("/users/:id", auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).send("No such user");
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
}
);

router.put("/users/:id", auth, async (req, res) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }).select("-password");
        if (!user) return res.status(404).send("No such user");
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.patch("/users/:id", auth, async (req, res) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }).select("-password");
        if (!user) return res.status(404).send("No such user");
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete("/users/:id", auth, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id).select("-password");
        if (!user) return res.status(404).send("No such user");
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
})


module.exports = router;