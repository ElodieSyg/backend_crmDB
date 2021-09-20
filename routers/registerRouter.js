const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
// Import model
const User = require("../models/usersModel");

router.route("/")
    .post(async (req, res) => { // Add an user in database
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);

        const emailRegex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
        const passwordRegex = new RegExp(/[0-9a-zA-Z]{6,}/);

        if (emailRegex.test(email) && passwordRegex.test(password)) {
            try {
                await User.create({ email, password: hashedPassword });
            } catch (error) {
                return res.status(400).json({
                    message: "This user already exist",
                });
            };
        } else {
            return res.status(400).json({
                message: "Incorrect email or password !"
            });
        };

        res.status(201).json({
            message: `User created with email: ${email}`,
        });

    });

module.exports = router;