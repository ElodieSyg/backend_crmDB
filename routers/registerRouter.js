const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
// Import model
const User = require("../models/usersModel");

router.route("/")
    .post(async (req, res) => {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);

        try {
            await User.create({ email, password: hashedPassword });
        } catch (error) {
            return res.status(400).json({
                message: "This user already exist",
            });
        };

        res.status(201).json({
            message: `User created with email: ${email}`,
        });

    });

module.exports = router;