const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
// Import models
const User = require("../models/usersModel");
// Import middlewares
const protect = require("../middlewares/protect");

router.route("/")
    .post(async (req, res) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!user || !isPasswordValid) {
            res.status(400).json({
                message: "Invalid email or password "
            });
        };

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

        res.cookie("jwt", token, { httpOnly: true, secure: false });

        res.json({
            message: "Here is your cookie for subsequent requests !",
        });
    })
    .get(protect, async (req, res) => {
        console.log("This user come from _id: ", req.cookies.jwtData._id);

        res.status(200).json({
            message: "You are authorized",
        });
    });

module.exports = router;