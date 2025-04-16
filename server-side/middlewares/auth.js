const jwt = require("mongoose");
module.exports = (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token)
            return res.status(401).send("Access Denied, no token provided");
        req.payload = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.status(400).send(err);
    }
};