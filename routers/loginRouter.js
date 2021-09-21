const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
// Import models
const User = require("../models/usersModel");
// Import middlewares
const protect = require("../middlewares/protect");

router.route("/")
    .post(async (req, res) => { // Give token to user
        const { email, password } = req.body; // recupère les infos qui proviennent du front 
        const user = await User.findOne({ email });

        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                res.status(400).json({
                    message: "Invalid email or password "
                });
            };

            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

            res.cookie("jwt", token, { httpOnly: true, secure: false });

            res.json({
                message: "Here is your cookie for subsequent requests !",
            });
        } else {
            res.status(400).json({
                message: "User don't exist",
            });
        };
    })
    .get(protect, async (req, res) => {
        console.log("This user come from _id: ", req.cookies.jwtData._id);

        res.status(200).json({
            message: "You are authorized",
        });
    });

module.exports = router;